import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrmSidebar } from "@/components/crm-sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function FeedbackPage() {
  const { id, personId } = useParams<{ id: string; personId: string }>();
  const navigate = useNavigate();
  console.log(personId)
  const handleClose = () => {
    navigate(`/task/${id}/users`);
  };

  const handleCancel = () => {
    navigate(`/task/${id}/users`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log("Форма отправлена");
    navigate(`/task/${id}/users`);
  };

  return (
    <div className="crm-layout">
      <CrmSidebar />

      <main className="crm-main">
        <div className="feedback-card">
          {/* Header */}
          <div className="feedback-card-header">
            <h2 className="feedback-card-title">
              Калинина Ирина
            </h2>
            <button
              onClick={handleClose}
              className="feedback-close-btn"
              aria-label="Закрыть"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Feedback Type Select */}
            <div className="space-y-2">
              <Label htmlFor="feedback-type" className="text-sm font-medium">
                Тип отзыва
              </Label>
              <Select>
                <SelectTrigger id="feedback-type" className="w-full">
                  <SelectValue placeholder="Выберете из списка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Положительный</SelectItem>
                  <SelectItem value="negative">Отрицательный</SelectItem>
                  <SelectItem value="neutral">Нейтральный</SelectItem>
                  <SelectItem value="suggestion">Предложение</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory Select */}
            <div className="space-y-2">
              <Label htmlFor="subcategory" className="text-sm font-medium">
                Подкатегория
              </Label>
              <Select>
                <SelectTrigger id="subcategory" className="w-full">
                  <SelectValue placeholder="Выберете из списка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="communication">Коммуникация</SelectItem>
                  <SelectItem value="quality">Качество работы</SelectItem>
                  <SelectItem value="deadlines">Соблюдение сроков</SelectItem>
                  <SelectItem value="teamwork">Работа в команде</SelectItem>
                  <SelectItem value="professionalism">Профессионализм</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-2">
              <Label htmlFor="comment" className="text-sm font-medium">
                Комментарий
              </Label>
              <Textarea
                id="comment"
                placeholder="Напишите ваш комментарий здесь"
                className="min-h-[100px] resize-y"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-6 border-t border-[#E5E5E5]">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="px-6"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="px-6 bg-[#FF383C] hover:bg-[#FF383C]/90"
              >
                Отправить
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}