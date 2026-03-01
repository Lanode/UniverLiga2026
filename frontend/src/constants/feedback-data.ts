// Emotion types
export const EMOTIONS = {
  POSITIVE: "positive",
  NEUTRAL: "neutral",
  NEGATIVE: "negative",
} as const;

export type EmotionType = typeof EMOTIONS[keyof typeof EMOTIONS];

// Emoji URLs for emotions
export const EMOTION_EMOJIS = {
  [EMOTIONS.POSITIVE]: "https://api.builder.io/api/v1/image/assets/TEMP/35912a8d9aa4064b57a8b21eb92593c2123cd8ab?width=114",
  [EMOTIONS.NEUTRAL]: "https://api.builder.io/api/v1/image/assets/TEMP/fcecd5af10e0a1b95e6662169c7f9dd5da8ae9b3?width=114",
  [EMOTIONS.NEGATIVE]: "https://api.builder.io/api/v1/image/assets/TEMP/04ac34b81dc502232b1ece1818fe7452a507f18c?width=114",
} as const;

// Emotion colors
export const EMOTION_COLORS = {
  [EMOTIONS.POSITIVE]: {
    background: "#EDFFE8",
    glow: "rgba(63, 255, 63, 0.40)",
    border: "#E5E5E5",
  },
  [EMOTIONS.NEUTRAL]: {
    background: "#FFFDE8",
    glow: "rgba(255, 226, 63, 0.40)",
    border: "#E5E5E5",
  },
  [EMOTIONS.NEGATIVE]: {
    background: "#FFE8E8",
    glow: "rgba(255, 63, 63, 0.40)",
    border: "#E5E5E5",
  },
} as const;

// Subcategories data
export interface Subcategory {
  id: string;
  text: string;
  icon: string;
}

