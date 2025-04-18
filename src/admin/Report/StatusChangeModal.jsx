// src/admin/StatusChangeModal.jsx

import React, { useState } from "react";
import axios from "axios";

export default function StatusChangeModal({ report, onClose, onSuccess }) {
  const [status, setStatus] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const BASE_URL = process.env.REACT_APP_API_URL;
  const handleSubmit = async () => {
    if (!status) {
      alert("상태를 선택해주세요.");
      return;
    }

    try {
      const payload = {
        status,
        reason: status === "ACCEPT" ? adminMessage : null,
      };

      await axios.put(`${BASE_URL}/admin/reports/${report.reportId}`, payload, {
        withCredentials: true,
      });

      alert("상태가 변경되었습니다.");
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "상태 변경 중 오류 발생");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">상태 변경</h2>
        <p className="mb-2">
          <strong>피신고자:</strong> {report.reportedUserNickName}
        </p>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="">상태 선택</option>
          <option value="ACCEPT">ACCEPT</option>
          <option value="REJECTED">REJECTED</option>
        </select>

        {status === "ACCEPT" && (
          <textarea
            className="w-full border p-2 rounded mb-3"
            rows={4}
            placeholder="피신고자에게 전달할 메시지 입력"
            value={adminMessage}
            onChange={(e) => setAdminMessage(e.target.value)}
          />
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
