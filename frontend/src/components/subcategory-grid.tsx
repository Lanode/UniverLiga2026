import { EMOTION_COLORS, type EmotionType, type Subcategory } from "@/constants/feedback-data";
import "./subcategory-grid.css";

interface SubcategoryGridProps {
  subcategories: Subcategory[];
  selectedSubcategories: Set<string>;
  onToggleSubcategory: (id: string) => void;
  emotion: EmotionType;
}

export function SubcategoryGrid({
  subcategories,
  selectedSubcategories,
  onToggleSubcategory,
  emotion,
}: SubcategoryGridProps) {
  const colors = EMOTION_COLORS[emotion];

  return (
    <div className="subcategory-grid">
      {subcategories.map((subcategory) => {
        const isSelected = selectedSubcategories.has(subcategory.id);

        return (
          <button
            key={subcategory.id}
            onClick={() => onToggleSubcategory(subcategory.id)}
            className="subcategory-card"
            style={{
              backgroundColor: isSelected ? colors.background : "#FFF",
            }}
            aria-pressed={isSelected}
          >
            <img
              src={subcategory.icon}
              alt={subcategory.label}
              className="subcategory-icon"
            />
            <span className="subcategory-label">{subcategory.label}</span>
          </button>
        );
      })}
    </div>
  );
}
