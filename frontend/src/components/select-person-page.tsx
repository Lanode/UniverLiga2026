import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrmSidebar } from "@/components/crm-sidebar";

interface Person {
  id: number;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;

  role: string;
  reviewed: boolean;
}

const PEOPLE: Person[] = [
  { id: 1, full_name: "Иванов Иван", role: "Тестировщик", reviewed: true, email: "test@test.ru", username: "test", is_active: true, is_superuser: true, created_at: "", updated_at: "" },
  { id: 2, full_name: "Калинина Ирина", role: "Разработчик", reviewed: false, email: "test@test.ru", username: "test", is_active: true, is_superuser: true, created_at: "", updated_at: "" },
  { id: 3, full_name: "Миронов Вячеслав", role: "Разработчик", reviewed: false, email: "test@test.ru", username: "test", is_active: true, is_superuser: true, created_at: "", updated_at: "" },
];

function PersonAvatar() {
  return (
    <div className="person-avatar">
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="18" cy="18" r="18" fill="#E5E5E5" />
        <ellipse cx="18" cy="15" rx="6" ry="6.5" fill="#9E9E9E" />
        <path
          d="M6 30c0-6.627 5.373-10 12-10s12 3.373 12 10"
          stroke="#9E9E9E"
          strokeWidth="2"
          fill="#9E9E9E"
        />
        {/* face details */}
        <circle cx="15.5" cy="14.5" r="1" fill="white" />
        <circle cx="20.5" cy="14.5" r="1" fill="white" />
        <path d="M15.5 17.5 Q18 19.5 20.5 17.5" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function SelectPersonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(`/task/${id}`);
  };

  const handleClose = () => {
    navigate(`/task/${id}`);
  };

  const handleLeaveReview = (personId: number) => {
    navigate(`/task/${id}/feedback/${personId}`);
  };

  return (
    <div className="crm-layout">
      <CrmSidebar />

      <main className="crm-main">
        <div className="feedback-card">
          {/* Header */}
          <div className="feedback-card-header">
            <h2 className="feedback-card-title">
              О ком хотите оставить обратную связь?
            </h2>
            <button
              onClick={handleClose}
              className="feedback-close-btn"
              aria-label="Закрыть"
            >
              <X size={16} />
            </button>
          </div>

          {/* People List */}
          <div className="feedback-people-list">
            {PEOPLE.map((person, index) => (
              <div key={person.id}>
                <div className="feedback-person-row">
                  <div className="feedback-person-info">
                    <PersonAvatar />
                    <div className="feedback-person-details">
                      <span className="feedback-person-name">{person.full_name}</span>
                      <span className="feedback-person-role">{person.role}</span>
                    </div>
                  </div>

                  {person.reviewed ? (
                    <span className="feedback-already-reviewed">
                      Вы уже оставляли отзыв
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLeaveReview(person.id)}
                      className="feedback-leave-btn"
                    >
                      Оставить отзыв
                    </Button>
                  )}
                </div>
                {index < PEOPLE.length - 1 && (
                  <div className="feedback-person-divider" />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="feedback-card-footer">
            <button onClick={handleCancel} className="feedback-cancel-btn">
              Отмена
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
