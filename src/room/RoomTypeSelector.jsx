import React from "react";
import { motion } from "framer-motion";

const roomTypes = [
  { label: "식당", value: "식당" },
  { label: "카페", value: "카페" },
  { label: "스터디", value: "스터디" },
  { label: "여행", value: "여행" },
  { label: "운동", value: "운동" },
  { label: "게임", value: "게임" },
  { label: "취미", value: "취미" },
  { label: "봉사", value: "봉사" },
  { label: "멘토링", value: "멘토링" },
  { label: "책모임", value: "책모임" },
  { label: "음악", value: "음악" },
  { label: "영화", value: "영화" },
  { label: "산책", value: "산책" },
  { label: "바(술)", value: "바(술)" },
];

export default function RoomTypeSelector({ selectedType, onChange }) {
  const handleSelect = (type) => {
    if (selectedType === type) return; // 이미 선택된 타입이면 무시
    onChange(type);
  };

  return (
    <div className="space-y-2">
      <label className="block font-semibold">방 타입</label>
      <div className="flex flex-wrap gap-2">
        {roomTypes.map((type) => (
          <motion.button
            key={type.value}
            type="button" // ✅ submit 방지
            onClick={() => handleSelect(type.value)}
            className={`px-4 py-2 rounded-full border transition-all duration-300 ${
              selectedType === type.value
                ? "bg-blue-500 text-white scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-blue-100"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {type.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
