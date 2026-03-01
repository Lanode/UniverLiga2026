from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy import func, select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession

from .models.feedback import (
    Feedback, 
    FeedbackType, 
    FeedbackSubcategory, 
    FeedbackResponse,
    feedback_subcategory_association,
    feedback_response_subcategory_association
)
from .models.user import User


async def marks(
    days: int = 30,
    user_id: Optional[int] = None,
    department: Optional[str] = None,
    db: Optional[AsyncSession] = None
) -> List[Dict[str, Any]]:
    """
    Возвращает статистику по оценкам (типам фидбека) по дням.
    
    Args:
        days: Количество дней для анализа (по умолчанию 30)
        user_id: ID сотрудника для фильтрации (опционально)
        department: Отдел для фильтрации (опционально)
        db: Сессия базы данных
    
    Returns:
        Список словарей с статистикой по дням
    """
    if db is None:
        raise ValueError("Сессия базы данных (db) обязательна")
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    # Базовый запрос
    query = select(
        func.date(Feedback.created_at).label('date'),
        Feedback.feedback_type,
        func.count(Feedback.id).label('count')
    ).where(
        Feedback.created_at >= start_date
    ).group_by(
        func.date(Feedback.created_at),
        Feedback.feedback_type
    ).order_by(
        func.date(Feedback.created_at).desc()
    )
    
    # Применяем фильтры
    if user_id is not None:
        query = query.where(Feedback.user_id == user_id)
    
    if department is not None:
        # Фильтр по отделу через подкатегории
        subquery = select(FeedbackSubcategory.id).where(
            FeedbackSubcategory.department == department
        )
        query = query.where(
            Feedback.id.in_(
                select(feedback_subcategory_association.c.feedback_id).where(
                    feedback_subcategory_association.c.subcategory_id.in_(subquery)
                )
            )
        )
    
    result = await db.execute(query)
    rows = result.fetchall()
    
    # Группируем результаты по дням
    stats_by_date = {}
    for date_str, feedback_type, count in rows:
        if date_str not in stats_by_date:
            stats_by_date[date_str] = {
                'date': date_str,
                'positive_count': 0,
                'negative_count': 0,
                'neutral_count': 0,
                'total_count': 0
            }
        
        stats = stats_by_date[date_str]
        if feedback_type == FeedbackType.positive:
            stats['positive_count'] = count
        elif feedback_type == FeedbackType.negative:
            stats['negative_count'] = count
        elif feedback_type == FeedbackType.neutral:
            stats['neutral_count'] = count
        
        stats['total_count'] += count
    
    # Заполняем пропущенные дни нулевыми значениями
    result_list = []
    for i in range(days):
        current_date = (end_date - timedelta(days=i)).date()
        date_str = current_date.isoformat()
        
        if date_str in stats_by_date:
            result_list.append(stats_by_date[date_str])
        else:
            result_list.append({
                'date': date_str,
                'positive_count': 0,
                'negative_count': 0,
                'neutral_count': 0,
                'total_count': 0
            })
    
    return result_list


async def subcategories_marks(
    days: int = 30,
    user_id: Optional[int] = None,
    department: Optional[str] = None,
    db: Optional[AsyncSession] = None
) -> List[Dict[str, Any]]:
    """
    Возвращает статистику по подкатегориям фидбека по дням.
    
    Args:
        days: Количество дней для анализа (по умолчанию 30)
        user_id: ID сотрудника для фильтрации (опционально)
        department: Отдел для фильтрации (опционально)
        db: Сессия базы данных
    
    Returns:
        Список словарей с статистикой по подкатегориям по дням
    """
    if db is None:
        raise ValueError("Сессия базы данных (db) обязательна")
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    # Базовый запрос с join подкатегорий
    query = select(
        func.date(Feedback.created_at).label('date'),
        FeedbackSubcategory.text.label('subcategory_name'),
        Feedback.feedback_type,
        func.count(Feedback.id).label('count')
    ).join(
        Feedback.subcategories
    ).where(
        Feedback.created_at >= start_date
    ).group_by(
        func.date(Feedback.created_at),
        FeedbackSubcategory.text,
        Feedback.feedback_type
    ).order_by(
        func.date(Feedback.created_at).desc(),
        FeedbackSubcategory.text
    )
    
    # Применяем фильтры
    if user_id is not None:
        query = query.where(Feedback.user_id == user_id)
    
    if department is not None:
        query = query.where(FeedbackSubcategory.department == department)
    
    result = await db.execute(query)
    rows = result.fetchall()
    
    # Группируем результаты по дням и подкатегориям
    stats_by_date = {}
    for date_str, subcategory_name, feedback_type, count in rows:
        if date_str not in stats_by_date:
            stats_by_date[date_str] = []
        
        stats_by_date[date_str].append({
            'subcategory_name': subcategory_name,
            'feedback_type': feedback_type.value,
            'count': count,
            'date': date_str
        })
    
    # Заполняем пропущенные дни пустыми списками
    result_list = []
    for i in range(days):
        current_date = (end_date - timedelta(days=i)).date()
        date_str = current_date.isoformat()
        
        if date_str in stats_by_date:
            result_list.extend(stats_by_date[date_str])
        else:
            # Для дней без данных возвращаем пустой список подкатегорий
            pass
    
    return result_list


async def comments_pull(
    days: int = 30,
    user_id: Optional[int] = None,
    department: Optional[str] = None,
    db: Optional[AsyncSession] = None
) -> List[Dict[str, Any]]:
    """
    Возвращает статистику по комментариям (текстовым отзывам) по дням.
    
    Args:
        days: Количество дней для анализа (по умолчанию 30)
        user_id: ID сотрудника для фильтрации (опционально)
        department: Отдел для фильтрации (опционально)
        db: Сессия базы данных
    
    Returns:
        Список словарей с статистикой по комментариям по дням
    """
    if db is None:
        raise ValueError("Сессия базы данных (db) обязательна")
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    # Базовый запрос для статистики комментариев
    query = select(
        func.date(Feedback.created_at).label('date'),
        func.count(Feedback.id).label('comment_count'),
        func.avg(func.length(Feedback.comment)).label('avg_length'),
        Feedback.feedback_type
    ).where(
        Feedback.created_at >= start_date,
        Feedback.comment != ''  # Только комментарии с текстом
    ).group_by(
        func.date(Feedback.created_at),
        Feedback.feedback_type
    ).order_by(
        func.date(Feedback.created_at).desc()
    )
    
    # Применяем фильтры
    if user_id is not None:
        query = query.where(Feedback.user_id == user_id)
    
    if department is not None:
        # Фильтр по отделу через подкатегории
        subquery = select(FeedbackSubcategory.id).where(
            FeedbackSubcategory.department == department
        )
        query = query.where(
            Feedback.id.in_(
                select(feedback_subcategory_association.c.feedback_id).where(
                    feedback_subcategory_association.c.subcategory_id.in_(subquery)
                )
            )
        )
    
    result = await db.execute(query)
    rows = result.fetchall()
    
    # Группируем результаты по дням
    stats_by_date = {}
    for date_str, comment_count, avg_length, feedback_type in rows:
        if date_str not in stats_by_date:
            stats_by_date[date_str] = {
                'date': date_str,
                'comment_count': 0,
                'total_avg_length': 0,
                'feedback_types': {}
            }
        
        stats = stats_by_date[date_str]
        stats['comment_count'] += comment_count
        
        # Учитываем среднюю длину (взвешенное среднее)
        if avg_length is not None:
            current_total = stats['total_avg_length'] * (stats['comment_count'] - comment_count)
            stats['total_avg_length'] = (current_total + avg_length * comment_count) / stats['comment_count']
        
        # Сохраняем распределение по типам фидбека
        if feedback_type.value not in stats['feedback_types']:
            stats['feedback_types'][feedback_type.value] = 0
        stats['feedback_types'][feedback_type.value] += comment_count
    
    # Заполняем пропущенные дни нулевыми значениями
    result_list = []
    for i in range(days):
        current_date = (end_date - timedelta(days=i)).date()
        date_str = current_date.isoformat()
        
        if date_str in stats_by_date:
            stats = stats_by_date[date_str]
            result_list.append({
                'date': stats['date'],
                'comment_count': stats['comment_count'],
                'avg_length': round(stats['total_avg_length'], 2) if stats['comment_count'] > 0 else 0,
                'feedback_type_distribution': stats['feedback_types']
            })
        else:
            result_list.append({
                'date': date_str,
                'comment_count': 0,
                'avg_length': 0,
                'feedback_type_distribution': {}
            })
    
    return result_list


async def time_stat(
    days: int = 30,
    user_id: Optional[int] = None,
    department: Optional[str] = None,
    db: Optional[AsyncSession] = None
) -> List[Dict[str, Any]]:
    """
    Возвращает временную статистику активности по дням и часам.
    
    Args:
        days: Количество дней для анализа (по умолчанию 30)
        user_id: ID сотрудника для фильтрации (опционально)
        department: Отдел для фильтрации (опционально)
        db: Сессия базы данных
    
    Returns:
        Список словарей с временной статистикой по дням и часам
    """
    if db is None:
        raise ValueError("Сессия базы данных (db) обязательна")
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    # Статистика по фидбекам по часам
    feedback_query = select(
        func.date(Feedback.created_at).label('date'),
        func.extract('hour', Feedback.created_at).label('hour'),
        func.count(Feedback.id).label('feedback_count')
    ).where(
        Feedback.created_at >= start_date
    ).group_by(
        func.date(Feedback.created_at),
        func.extract('hour', Feedback.created_at)
    ).order_by(
        func.date(Feedback.created_at).desc(),
        func.extract('hour', Feedback.created_at)
    )
    
    # Статистика по ответам по часам
    response_query = select(
        func.date(FeedbackResponse.created_at).label('date'),
        func.extract('hour', FeedbackResponse.created_at).label('hour'),
        func.count(FeedbackResponse.id).label('response_count')
    ).where(
        FeedbackResponse.created_at >= start_date
    ).group_by(
        func.date(FeedbackResponse.created_at),
        func.extract('hour', FeedbackResponse.created_at)
    ).order_by(
        func.date(FeedbackResponse.created_at).desc(),
        func.extract('hour', FeedbackResponse.created_at)
    )
    
    # Применяем фильтры к запросам фидбеков
    if user_id is not None:
        feedback_query = feedback_query.where(Feedback.user_id == user_id)
    
    if department is not None:
        # Фильтр по отделу через подкатегории для фидбеков
        subquery = select(FeedbackSubcategory.id).where(
            FeedbackSubcategory.department == department
        )
        feedback_query = feedback_query.where(
            Feedback.id.in_(
                select(feedback_subcategory_association.c.feedback_id).where(
                    feedback_subcategory_association.c.subcategory_id.in_(subquery)
                )
            )
        )
    
    # Выполняем запросы
    feedback_result = await db.execute(feedback_query)
    response_result = await db.execute(response_query)
    
    feedback_rows = feedback_result.fetchall()
    response_rows = response_result.fetchall()
    
    # Создаем структуру для хранения статистики
    stats_by_date_hour = {}
    
    # Обрабатываем фидбеки
    for date_str, hour, feedback_count in feedback_rows:
        key = f"{date_str}_{int(hour)}"
        if key not in stats_by_date_hour:
            stats_by_date_hour[key] = {
                'date': date_str,
                'hour': int(hour),
                'feedback_count': 0,
                'response_count': 0
            }
        stats_by_date_hour[key]['feedback_count'] = feedback_count
    
    # Обрабатываем ответы
    for date_str, hour, response_count in response_rows:
        key = f"{date_str}_{int(hour)}"
        if key not in stats_by_date_hour:
            stats_by_date_hour[key] = {
                'date': date_str,
                'hour': int(hour),
                'feedback_count': 0,
                'response_count': 0
            }
        stats_by_date_hour[key]['response_count'] = response_count
    
    # Преобразуем в список и сортируем
    result_list = list(stats_by_date_hour.values())
    result_list.sort(key=lambda x: (x['date'], x['hour']), reverse=True)
    
    return result_list


async def command_stat(
    days: int = 30,
    user_id: Optional[int] = None,
    department: Optional[str] = None,
    db: Optional[AsyncSession] = None
) -> List[Dict[str, Any]]:
    """
    Возвращает командную статистику взаимодействий между сотрудниками по дням.
    
    Args:
        days: Количество дней для анализа (по умолчанию 30)
        user_id: ID сотрудника для фильтрации (опционально)
        department: Отдел для фильтрации (опционально)
        db: Сессия базы данных
    
    Returns:
        Список словарей с командной статистикой по дням
    """
    if db is None:
        raise ValueError("Сессия базы данных (db) обязательна")
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    # Базовый запрос для статистики взаимодействий
    query = select(
        func.date(Feedback.created_at).label('date'),
        Feedback.user_id.label('sender_id'),
        Feedback.user_to_id.label('receiver_id'),
        func.count(Feedback.id).label('feedback_count'),
        func.count(FeedbackResponse.id).label('response_count')
    ).outerjoin(
        FeedbackResponse, Feedback.id == FeedbackResponse.feedback_id
    ).where(
        Feedback.created_at >= start_date
    ).group_by(
        func.date(Feedback.created_at),
        Feedback.user_id,
        Feedback.user_to_id
    ).order_by(
        func.date(Feedback.created_at).desc(),
        Feedback.user_id,
        Feedback.user_to_id
    )
    
    # Применяем фильтры
    if user_id is not None:
        # Фильтр по отправителю или получателю
        query = query.where(
            or_(
                Feedback.user_id == user_id,
                Feedback.user_to_id == user_id
            )
        )
    
    if department is not None:
        # Фильтр по отделу через подкатегории
        subquery = select(FeedbackSubcategory.id).where(
            FeedbackSubcategory.department == department
        )
        query = query.where(
            Feedback.id.in_(
                select(feedback_subcategory_association.c.feedback_id).where(
                    feedback_subcategory_association.c.subcategory_id.in_(subquery)
                )
            )
        )
    
    result = await db.execute(query)
    rows = result.fetchall()
    
    # Формируем результат
    result_list = []
    for date_str, sender_id, receiver_id, feedback_count, response_count in rows:
        result_list.append({
            'date': date_str,
            'sender_id': sender_id,
            'receiver_id': receiver_id,
            'feedback_count': feedback_count,
            'response_count': response_count or 0
        })
    
    return result_list