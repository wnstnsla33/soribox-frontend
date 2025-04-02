import React from "react";

const categories = [
  { label: "전체", value: "" },
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

export default function RoomCategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          className={`px-3 py-1 rounded-full border text-sm transition-all duration-200 
            ${
              selected === cat.value
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
