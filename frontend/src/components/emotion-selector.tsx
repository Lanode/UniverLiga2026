import { EMOTIONS, EMOTION_EMOJIS, EMOTION_COLORS, type EmotionType } from "@/constants/feedback-data";
import "./emotion-selector.css";

interface EmotionSelectorProps {
  selectedEmotion: EmotionType | null;
  onSelectEmotion: (emotion: EmotionType) => void;
}

export function EmotionSelector({
  selectedEmotion,
  onSelectEmotion,
}: EmotionSelectorProps) {
  const emotionOrder: EmotionType[] = [
    EMOTIONS.POSITIVE,
    EMOTIONS.NEUTRAL,
    EMOTIONS.NEGATIVE,
  ];

  const emotionLabels: Record<EmotionType, string> = {
    [EMOTIONS.POSITIVE]: "Положительный",
    [EMOTIONS.NEUTRAL]: "Смешанный",
    [EMOTIONS.NEGATIVE]: "Отрицательный",
  };

  return (
    <div className="emotion-selector-container">
      <div className="emotion-buttons-grid">
        {emotionOrder.map((emotion) => {
          const isSelected = selectedEmotion === emotion;
          const colors = EMOTION_COLORS[emotion];
          const emoji = EMOTION_EMOJIS[emotion];
          const label = emotionLabels[emotion];

          return (
            <button
              type="button"
              key={emotion}
              onClick={() => onSelectEmotion(emotion)}
              className={`emotion-button ${isSelected ? "emotion-button-selected" : ""}`}
              style={{
                backgroundColor: colors.background,
                ...(isSelected && {
                  boxShadow: `0 2px 15px -3px ${colors.glow}, 0 -2px 15px -4px ${colors.glow}`,
                }),
              }}
              aria-label={label}
              aria-pressed={isSelected}
            >
              <img
                src={emoji}
                alt={label}
                className="emotion-emoji"
              />
            </button>
          );
        })}
      </div>
      <div className="emotion-labels">
        {emotionOrder.map((emotion) => (
          <div
            key={`${emotion}-label`}
            className={`emotion-label ${
              selectedEmotion === emotion ? "emotion-label-active" : ""
            }`}
          >
            {emotionLabels[emotion]}
          </div>
        ))}
      </div>
    </div>
  );
}
