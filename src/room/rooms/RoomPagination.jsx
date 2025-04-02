import React from "react";

export default function RoomPagination({ currentPage, totalPages, onChange }) {
  return (
    <div className="flex justify-center mt-8 gap-2">
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
      >
        이전
      </button>
      <span className="px-3 py-1">
        {currentPage + 1} / {totalPages}
      </span>
      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage + 1 === totalPages}
        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
      >
        다음
      </button>
    </div>
  );
}
