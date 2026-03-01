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

// Типы отзывов с цветами
const FEEDBACK_TYPES = [
  { value: "positive", label: "Положительный", color: "#10B981" }, // зеленый
  { value: "negative", label: "Отрицательный", color: "#EF4444" }, // красный
  { value: "neutral", label: "Нейтральный", color: "#6B7280" }, // серый
  { value: "suggestion", label: "Предложение", color: "#3B82F6" }, // синий
];

// Подкатегории
const SUBCATEGORIES = [
  { value: "communication", label: "Коммуникация" },
  { value: "quality", label: "Качество работы" },
  { value: "deadlines", label: "Соблюдение сроков" },
  { value: "teamwork", label: "Работа в команде" },
  { value: "professionalism", label: "Профессионализм" },
];

// Компонент цветной точки
function ColorDot({ color }: { color: string }) {
  return (
    <div 
      className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}

export function FeedbackPage() {
  const { id, personId } = useParams<{ id: string; personId: string }>();
  const navigate = useNavigate();

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
    // Перенаправление на страницу успешной отправки
    navigate(`/task/${id}/feedback/${personId}/success`);
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
            {/* Feedback Type Select with colored dots */}
            <div className="space-y-2">
              <Label htmlFor="feedback-type" className="text-sm font-medium">
                Тип отзыва
              </Label>
              <Select>
                <SelectTrigger id="feedback-type" className="w-full">
                  <SelectValue placeholder="Выберете из списка" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {FEEDBACK_TYPES.map((type) => (
                    <SelectItem 
                      key={type.value} 
                      value={type.value}
                      className="flex items-center py-2"
                    >
                      <div className="flex items-center">
                        <ColorDot color={type.color} />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
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
                <SelectContent className="max-h-60">
                  {SUBCATEGORIES.map((category) => (
                    <SelectItem 
                      key={category.value} 
                      value={category.value}
                      className="py-2"
                    >
                      {category.label}
                    </SelectItem>
                  ))}
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
                className="px-6 bg-[#589CFF] hover:bg-[#589CFF]/90 text-white"
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
