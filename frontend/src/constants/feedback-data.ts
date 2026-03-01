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
  label: string;
  icon: string;
}

export const EMOTION_SUBCATEGORIES: Record<EmotionType, Subcategory[]> = {
  [EMOTIONS.POSITIVE]: [
    {
      id: "positive_1",
      label: "Хорошо объяснил(-а)",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/9587671036812c3cba99b2df2bd12d6c8067ea4d?width=78",
    },
    {
      id: "positive_2",
      label: "Написал(-а) хорошее ТЗ",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/ea36b16f1d80d02ba82041b5afde880cecf487e8?width=51",
    },
    {
      id: "positive_3",
      label: "Учел(-ла) все пожелания",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/cb733ebffca3dbdbf43e7ea3f3532d6e46545c80?width=51",
    },
    {
      id: "positive_4",
      label: "Сдал(-а) вовремя",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/5323429ee12e1d400023ae1ef58baa8126c25b7b?width=49",
    },
    {
      id: "positive_5",
      label: "Соблюдал(-а) договорённости",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/4eacbb513c9abba4b43f0f146671e2374ac9a63d?width=49",
    },
    {
      id: "positive_6",
      label: "Предупредил(-а) риски",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/0e92c03c8d49aaa4ecfc58824bf688fc3f830de2?width=49",
    },
    {
      id: "positive_7",
      label: "Отлично работал(-а) в команде",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/aabd7c6e84f08e90aaf2e4032402837eb18a3aef?width=49",
    },
  ],
  [EMOTIONS.NEUTRAL]: [
    {
      id: "neutral_1",
      label: "Хорошо объяснил(-а)",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/9587671036812c3cba99b2df2bd12d6c8067ea4d?width=78",
    },
    {
      id: "neutral_2",
      label: "Написал(-а) хорошее ТЗ",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/ea36b16f1d80d02ba82041b5afde880cecf487e8?width=51",
    },
    {
      id: "neutral_3",
      label: "Учел(-ла) все пожелания",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/cb733ebffca3dbdbf43e7ea3f3532d6e46545c80?width=51",
    },
    {
      id: "neutral_4",
      label: "Сдал(-а) вовремя",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/5323429ee12e1d400023ae1ef58baa8126c25b7b?width=49",
    },
    {
      id: "neutral_5",
      label: "Соблюдал(-а) договорённости",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/4eacbb513c9abba4b43f0f146671e2374ac9a63d?width=49",
    },
    {
      id: "neutral_6",
      label: "Предупредил(-а) риски",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/0e92c03c8d49aaa4ecfc58824bf688fc3f830de2?width=49",
    },
    {
      id: "neutral_7",
      label: "Отлично работал(-а) в команде",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/aabd7c6e84f08e90aaf2e4032402837eb18a3aef?width=49",
    },
  ],
  [EMOTIONS.NEGATIVE]: [
    {
      id: "negative_1",
      label: "Плохо объяснил(-а)",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/9587671036812c3cba99b2df2bd12d6c8067ea4d?width=78",
    },
    {
      id: "negative_2",
      label: "Написал(-а) плохое ТЗ",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/ea36b16f1d80d02ba82041b5afde880cecf487e8?width=51",
    },
    {
      id: "negative_3",
      label: "Не учел(-ла) пожелания",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/cb733ebffca3dbdbf43e7ea3f3532d6e46545c80?width=51",
    },
    {
      id: "negative_4",
      label: "Не сдал(-а) вовремя",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/5323429ee12e1d400023ae1ef58baa8126c25b7b?width=49",
    },
    {
      id: "negative_5",
      label: "Не соблюдал(-а) договорённости",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/4eacbb513c9abba4b43f0f146671e2374ac9a63d?width=49",
    },
    {
      id: "negative_6",
      label: "Не предупредил(-а) риски",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/0e92c03c8d49aaa4ecfc58824bf688fc3f830de2?width=49",
    },
    {
      id: "negative_7",
      label: "Плохо работал(-а) в команде",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/aabd7c6e84f08e90aaf2e4032402837eb18a3aef?width=49",
    },
  ],
};
