// Emotion types
export const EMOTIONS = {
  POSITIVE: "positive",
  NEUTRAL: "neutral",
  NEGATIVE: "negative",
} as const;

export type EmotionType = typeof EMOTIONS[keyof typeof EMOTIONS];

// Import emoji assets
import positiveEmoji from "@/assets/emojis/positive.svg";
import neutralEmoji from "@/assets/emojis/neutral.svg";
import negativeEmoji from "@/assets/emojis/negative.svg";

// Emoji ID to asset path mapping
export interface EmojiMapping {
  id: number;
  emotion: EmotionType;
  path: string;
}

export const EMOJI_MAPPING: EmojiMapping[] = [
  {
    id: 1,
    emotion: EMOTIONS.POSITIVE,
    path: positiveEmoji,
  },
  {
    id: 2,
    emotion: EMOTIONS.NEUTRAL,
    path: neutralEmoji,
  },
  {
    id: 3,
    emotion: EMOTIONS.NEGATIVE,
    path: negativeEmoji,
  },
];

// Helper function to get emoji path by ID
export const getEmojiPathById = (id: number): string | undefined => {
  return EMOJI_MAPPING.find(emoji => emoji.id === id)?.path;
};

// Helper function to get emoji path by emotion type
export const getEmojiPathByEmotion = (emotion: EmotionType): string | undefined => {
  return EMOJI_MAPPING.find(emoji => emoji.emotion === emotion)?.path;
};

// Helper function to get emotion type by emoji ID
export const getEmotionById = (id: number): EmotionType | undefined => {
  return EMOJI_MAPPING.find(emoji => emoji.id === id)?.emotion;
};

// Emoji URLs for emotions (backward compatibility)
export const EMOTION_EMOJIS = {
  [EMOTIONS.POSITIVE]: positiveEmoji,
  [EMOTIONS.NEUTRAL]: neutralEmoji,
  [EMOTIONS.NEGATIVE]: negativeEmoji,
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
  feedback_type_relation: string;
}

