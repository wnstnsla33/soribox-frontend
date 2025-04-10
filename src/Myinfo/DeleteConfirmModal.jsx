// components/DeleteConfirmModal.jsx
import React from "react";

export default function DeleteConfirmModal({
  isSNS,
  password,
  setPassword,
  errorMsg,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80">
        <h3 className="text-lg font-semibold mb-4">
          {isSNS ? "SNS 탈퇴 안내" : "비밀번호 확인"}
        </h3>

        {isSNS ? (
          <p className="text-sm text-gray-700 mb-4">
            SNS 회원은 비밀번호가 없어 즉시 탈퇴 처리됩니다.
            <br />
            정말 탈퇴하시겠습니까?
          </p>
        ) : (
          <>
            <input
              type="password"
              placeholder="비밀번호 입력"
              className="w-full px-3 py-2 border rounded mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMsg && (
              <p className="text-sm text-red-500 mb-2">{errorMsg}</p>
            )}
          </>
        )}

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}
