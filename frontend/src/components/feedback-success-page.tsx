import { useNavigate, useParams } from "react-router-dom";
import { CrmSidebar } from "@/components/crm-sidebar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function FeedbackSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleReturnToList = () => {
    navigate(`/task/${id}/users`);
  };

  const handleFinish = () => {
    // Здесь можно добавить логику завершения процесса
    // Например, переход на главную страницу или закрытие приложения
    navigate(`/task/${id}`);
  };

  return (
    <div className="crm-layout">
      <CrmSidebar />

      <main className="crm-main relative">
        {/* Фоновое изображение */}
        <div 
          className="feedback-success-bg"
          style={{
            backgroundImage: "url('/images/feedback-success-bg.png')",
          }}
        />

        {/* Диалоговое окно */}
        <div className="relative z-10">
          <AlertDialog open={true}>
            <AlertDialogContent className="feedback-success-dialog">
              <AlertDialogHeader className="text-left">
                <AlertDialogTitle className="feedback-success-title">
                  Ваш отзыв успешно отправлен!
                </AlertDialogTitle>
                <AlertDialogDescription className="feedback-success-description">
                  Вы можете вернуться к списку пользователей или завершить процесс обратной связи
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <AlertDialogFooter className="feedback-success-footer">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReturnToList}
                  className="feedback-success-return-btn"
                >
                  Вернуться к списку
                </Button>
                <Button
                  type="button"
                  onClick={handleFinish}
                  className="feedback-success-finish-btn"
                >
                  Завершить
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
    </div>
  );
}