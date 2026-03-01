from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional

from .. import schemas
from ..auth import get_current_active_user, get_current_superuser
from ..database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from ..report import (
    marks,
    subcategories_marks,
    comments_pull,
    time_stat,
    command_stat
)

router = APIRouter(prefix="/report", tags=["report"])

@router.get("/marks")
async def get_marks_report(
        days: int = 30,
        user_id: Optional[int] = None,
        department: Optional[str] = None,
        current_user: schemas.User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    >72@0I05B AB0B8AB8:C ?> >F5=:0< (B8?0< D8415:0) ?> 4=O<.
    
    Args:
        days: >;8G5AB2> 4=59 4;O 0=0;870 (?> C<>;G0=8N 30)
        user_id: ID A>B@C4=8:0 4;O D8;LB@0F88 (>?F8>=0;L=>)
        department: B45; 4;O D8;LB@0F88 (>?F8>=0;L=>)
    
    Returns:
        !?8A>: A;>20@59 A AB0B8AB8:>9 ?> 4=O<
    """
    try:
        # ;O >1KG=KE ?>;L7>20B5;59 D8;LB@C5< ?> 8E ID
        if not hasattr(current_user, 'is_superuser') or not current_user.is_superuser:
            user_id = current_user.id
        
        # ;O A>B@C4=8:>2 A @>;LN (>B45;><) D8;LB@C5< ?> 8E >B45;C
        if not hasattr(current_user, 'is_superuser') or not current_user.is_superuser:
            department = current_user.role
        
        report = await marks(days=days, user_id=user_id, department=department, db=db)
        return {"data": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating marks report: {str(e)}")

@router.get("/subcategories")
async def get_subcategories_report(
        days: int = 30,
        user_id: Optional[int] = None,
        department: Optional[str] = None,
        current_user: schemas.User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    >72@0I05B AB0B8AB8:C ?> ?>4:0B53>@8O< D8415:0 ?> 4=O<.
    
    Args:
        days: >;8G5AB2> 4=59 4;O 0=0;870 (?> C<>;G0=8N 30)
        user_id: ID A>B@C4=8:0 4;O D8;LB@0F88 (>?F8>=0;L=>)
        department: B45; 4;O D8;LB@0F88 (>?F8>=0;L=>)
    
    Returns:
        !?8A>: A;>20@59 A AB0B8AB8:>9 ?> ?>4:0B53>@8O< ?> 4=O<
    """
    try:
        # ;O >1KG=KE ?>;L7>20B5;59 D8;LB@C5< ?> 8E ID
        if not hasattr(current_user, 'is_superuser') or not current_user.is_superuser:
            user_id = current_user.id
        
        # ;O A>B@C4=8:>2 A @>;LN (>B45;><) D8;LB@C5< ?> 8E >B45;C
        if not hasattr(current_user, 'is_superuser') or not current_user.is_superuser:
            department = current_user.role
        
        report = await subcategories_marks(days=days, user_id=user_id, department=department, db=db)
        return {"data": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating subcategories report: {str(e)}")

@router.get("/comments")
async def get_comments_report(
        days: int = 30,
        user_id: Optional[int] = None,
        department: Optional[str] = None,
        current_user: schemas.User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    >72@0I05B AB0B8AB8:C ?> :><<5=B0@8O< (B5:AB>2K< >B7K20<) ?> 4=O<.
    
    Args:
        days: >;8G5AB2> 4=59 4;O 0=0;870 (?> C<>;G0=8N 30)
        user_id: ID A>B@C4=8:0 4;O D8;LB@0F88 (>?F8>=0;L=>)
        department: B45; 4;O D8;LB@0F88 (>?F8>=0;L=>)
    
    Returns:
        !?8A>: A;>20@59 A AB0B8AB8:>9 ?> :><<5=B0@8O< ?> 4=O<
    """
    try:
        # ;O >1KG=KE ?>;L7>20B5;59 D8;LB@C5< ?> 8E ID
        if not hasattr(current_user, 'is_superuser') or not current_user.is_superuser:
            user_id = current_user.id
        
        # ;O A>B@C4=8:>2 A @>;LN (>B45;><) D8;LB@C5< ?> 8E >B45;C
        if not hasattr(current_user, 'is_superuser') or not current_user.is_superuser:
            department = current_user.role
        
        report = await comments_pull(days=days, user_id=user_id, department=department, db=db)
        return {"data": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating comments report: {str(e)}")

@router.get("/time")
async def get_time_stat_report(
        days: int = 30,
        user_id: Optional[int] = None,
        department: Optional[str] = None,
        current_user: schemas.User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    >72@0I05B 2@5<5==CN AB0B8AB8:C 0:B82=>AB8 ?> 4=O< 8 G0A0<.
    
    Args:
        days: >;8G5AB2> 4=59 4;O 0=0;870 (?> C<>;G0=8N 30)
        user_id: ID A>B@C4=8:0 4;O D8;LB@0F88 (>?F8>=0;L=>)
        department: B45; 4;O D8;LB@0F88 (>?F8>=0;L=>)
    
    Returns:
        !?8A>: A;>20@59 A 2@5<5==>9 AB0B8AB8:>9 ?> 4=O< 8 G0A0<
    """
    try:
        # ;O >1KG=KE ?>;L7>20B5;59 D8;LB@C5< ?> 8E ID
        if not hasattr(current_user, 'is_superuser') or not current_user.is_superuser:
            user_id = current_user.id
        
        # ;O A>B@C4=8:>2 A @>;LN (>B45;><) D8;LB@C5< ?> 8E >B45;C
        if not hasattr(current_user, 'is_superuser') or not current_user.is_superuser:
            department = current_user.role
        
        report = await time_stat(days=days, user_id=user_id, department=department, db=db)
        return {"data": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating time stat report: {str(e)}")

@router.get("/command")
async def get_command_stat_report(
        days: int = 30,
        user_id: Optional[int] = None,
        department: Optional[str] = None,
        current_user: schemas.User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    >72@0I05B :><0=4=CN AB0B8AB8:C 2708<>459AB289 <564C A>B@C4=8:0<8 ?> 4=O<.
    
    Args:
        days: >;8G5AB2> 4=59 4;O 0=0;870 (?> C<>;G0=8N 30)
        user_id: ID A>B@C4=8:0 4;O D8;LB@0F88 (>?F8>=0;L=>)
        department: B45; 4;O D8;LB@0F88 (>?F8>=0;L=>)
    
    Returns:
        !?8A>: A;>20@59 A :><0=4=>9 AB0B8AB8:>9 ?> 4=O<
    """
    try:
        # ;O >1KG=KE ?>;L7>20B5;59 D8;LB@C5< ?> 8E ID
        if not hasattr(current_user, 'is_superuser') or not current_user.is_superuser:
            user_id = current_user.id
        
        # ;O A>B@C4=8:>2 A @>;LN (>B45;><) D8;LB@C5< ?> 8E >B45;C
        if not hasattr(current_user, 'is_superuser') or not current_user.is_superuser:
            department = current_user.role
        
        report = await command_stat(days=days, user_id=user_id, department=department, db=db)
        return {"data": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating command stat report: {str(e)}")

@router.get("/all")
async def get_all_reports(
        days: int = 30,
        user_id: Optional[int] = None,
        department: Optional[str] = None,
        current_user: schemas.User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    >72@0I05B 2A5 4>ABC?=K5 >BG5BK 2 >4=>< 70?@>A5.
    
    Args:
        days: >;8G5AB2> 4=59 4;O 0=0;870 (?> C<>;G0=8N 30)
        user_id: ID A>B@C4=8:0 4;O D8;LB@0F88 (>?F8>=0;L=>)
        department: B45; 4;O D8;LB@0F88 (>?F8>=0;L=>)
    
    Returns:
        !;>20@L A 2A5<8 >BG5B0<8
    """
    try:
        # ;O >1KG=KE ?>;L7>20B5;59 D8;LB@C5< ?> 8E ID
        if not hasattr(current_user, 'is_superuser') or not current_user.is_superuser:
            user_id = current_user.id
        
        # ;O A>B@C4=8:>2 A @>;LN (>B45;><) D8;LB@C5< ?> 8E >B45;C
        if not hasattr(current_user, 'is_superuser') or not current_user.is_superuser:
            department = current_user.role
        
        marks_report = await marks(days=days, user_id=user_id, department=department, db=db)
        subcategories_report = await subcategories_marks(days=days, user_id=user_id, department=department, db=db)
        comments_report = await comments_pull(days=days, user_id=user_id, department=department, db=db)
        time_report = await time_stat(days=days, user_id=user_id, department=department, db=db)
        command_report = await command_stat(days=days, user_id=user_id, department=department, db=db)
        
        return {
            "marks": marks_report,
            "subcategories": subcategories_report,
            "comments": comments_report,
            "time_stat": time_report,
            "command_stat": command_report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating all reports: {str(e)}")