import React, { useState } from "react";
import { createReport } from "./ReportAPI";

const ReportModal = ({
  isOpen,
  onClose,
  targetId,
  targetType,
  reportedUserId,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const resetAndClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("신고 사유를 입력해주세요.");
      return;
    }
    try {
      const msg = await createReport({
        targetId,
        targetType,
        reportedUserId,
        reason,
      });
      alert(msg.message);
      resetAndClose(); // 🔥 입력 초기화 + 모달 닫기
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">신고하기</h2>
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 mb-2"
          rows={4}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError("");
          }}
          placeholder="신고 사유를 입력해주세요."
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="flex justify-end gap-3">
          <button
            onClick={resetAndClose} // ✅ 취소 시 초기화
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
