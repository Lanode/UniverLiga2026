import { useState } from "react";
import { EMOJI_MAPPING, getEmojiPathById, getEmotionById } from "@/constants/feedback-data";
import { Button } from "@/components/ui/button";

export function EmojiMappingExample() {
  const [selectedEmojiId, setSelectedEmojiId] = useState<number | null>(null);

  const handleEmojiSelect = (emojiId: number) => {
    setSelectedEmojiId(emojiId);
  };

  const emojiPath = selectedEmojiId ? getEmojiPathById(selectedEmojiId) : null;
  const emotionType = selectedEmojiId ? getEmotionById(selectedEmojiId) : null;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Пример использования маппинга смайликов</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Выберите смайлик по ID:</h3>
        <div className="flex gap-2 flex-wrap">
          {EMOJI_MAPPING.map((emoji) => (
            <Button
              key={emoji.id}
              variant={selectedEmojiId === emoji.id ? "default" : "outline"}
              onClick={() => handleEmojiSelect(emoji.id)}
              className="flex items-center gap-2"
            >
              ID: {emoji.id} ({emoji.emotion})
            </Button>
          ))}
        </div>
      </div>

      {selectedEmojiId && emojiPath && emotionType && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3">Результат:</h3>
          <div className="flex items-center gap-4">
            <img
              src={emojiPath}
              alt={`Смайлик ${emotionType}`}
              className="w-16 h-16"
            />
            <div>
              <p className="text-sm text-gray-500">ID смайлика:</p>
              <p className="text-lg font-semibold">{selectedEmojiId}</p>
              <p className="text-sm text-gray-500 mt-2">Тип эмоции:</p>
              <p className="text-lg font-semibold">{emotionType}</p>
              <p className="text-sm text-gray-500 mt-2">Путь к ассету:</p>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                {emojiPath}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}