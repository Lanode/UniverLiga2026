import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrmSidebar } from "@/components/crm-sidebar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmotionSelector } from "@/components/emotion-selector";
import { SubcategoryGrid } from "@/components/subcategory-grid";
import {
  type EmotionType,
  type Subcategory,
} from "@/constants/feedback-data";
import "./feedback-page.css";
import { server } from "@/environment";

let EMOTION_SUBCATEGORIES: Subcategory[] = [];

export function FeedbackPage() {
  const { id, personId } = useParams<{ id: string; personId: string }>();
  const navigate = useNavigate();

  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(new Set());
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* -------------------------------------------------
   * Получаем список подкатегорий (эмоций) с сервера
   * ------------------------------------------------- */
  useEffect(() => {
    async function getFeedback() {
      const response = await fetch(`${server}/feedback/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            `${localStorage.getItem("token_type")} ${localStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok) throw new Error("Network error");
      EMOTION_SUBCATEGORIES = await response.json(); // массив Subcategory
    }

    getFeedback();
  }, []);

  const handleClose = () => navigate(`/task/${id}/users`);
  const handleCancel = () => navigate(`/task/${id}/users`);

  const handleEmotionSelect = (emotion: EmotionType) => {
    setSelectedEmotion(emotion);
    setSelectedSubcategories(new Set()); // сброс подкатегорий
  };

  const handleToggleSubcategory = (subId: string) => {
    const newSet = new Set(selectedSubcategories);
    newSet.has(subId) ? newSet.delete(subId) : newSet.add(subId);
    setSelectedSubcategories(newSet);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmotion) return;
    if (selectedSubcategories.size === 0) return;

    setIsSubmitting(true);

    try {
      /* -------------------------------------------------
       * Формируем массив subcategories в соответствии с API
       * ------------------------------------------------- */
      const subcategoriesPayload = Array.from(selectedSubcategories).map(
        (subId) => ({
          text: subId.toString(), // <-- строка, а не число
          feedback_type_relation: selectedEmotion,
          id: 0,
          created_at: new Date().toISOString(),
        })
      );

      /* -------------------------------------------------
       * Полный payload, включая обязательные поля
       * ------------------------------------------------- */
      const payload = {
        feedback_type: selectedEmotion,
        comment,
        subcategories: subcategoriesPayload,
        id: 0,
        user_id: isAnonymous ? null : personId, // получатель (может быть null)
        user_to_id: personId,                    // <-- обязательное поле
        created_at: new Date().toISOString(),
      };

      const response = await fetch(`${server}/feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            `${localStorage.getItem("token_type")} ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      navigate(`/task/${id}/feedback/${personId}/success`);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Ошибка при отправке отзыва. Пожалуйста, попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSubcategories = EMOTION_SUBCATEGORIES.filter(
    (i) => i.feedback_type_relation === selectedEmotion
  );

  return (
    <div className="crm-layout">
      <CrmSidebar />

      <main className="crm-main">
        <div className="feedback-dialog">
          {/* Header */}
          <div className="feedback-dialog-header">
            <h2 className="feedback-dialog-title">Введите ваш отзыв</h2>
            <button
              onClick={handleClose}
              className="feedback-close-btn"
              aria-label="Закрыть"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="feedback-form">
            {/* Тип отзыва */}
            <div className="form-field">
              <Label className="form-label">Тип отзыва</Label>
            </div>

            <EmotionSelector
              selectedEmotion={selectedEmotion}
              onSelectEmotion={handleEmotionSelect}
            />

            {/* Подкатегории */}
            {selectedEmotion && (
              <div className="form-field">
                <Label className="form-label">Подкатегория</Label>
                <SubcategoryGrid
                  subcategories={currentSubcategories}
                  selectedSubcategories={selectedSubcategories}
                  onToggleSubcategory={handleToggleSubcategory}
                  emotion={selectedEmotion}
                />
              </div>
            )}

            {/* Комментарий */}
            <div className="form-field">
              <Label htmlFor="comment" className="form-label">
                Комментарий
              </Label>
              <Textarea
                id="comment"
                placeholder="Напишите ваш комментарий здесь"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="feedback-textarea"
              />
            </div>

            {/* Анонимность */}
            <div className="anonymous-checkbox-wrapper">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="anonymous-checkbox"
              />
              <label htmlFor="anonymous" className="anonymous-label">
                Сделать отзыв анонимным
              </label>
            </div>

            {/* Кнопки */}
            <div className="feedback-footer">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="feedback-btn-cancel"
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="feedback-btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Отправка..." : "Отправить"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
