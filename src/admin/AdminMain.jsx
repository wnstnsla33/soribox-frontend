import React from "react";
import AdminReportList from "./Report/AdminReportList";

export default function AdminMain() {
  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ textAlign: "center" }}>
        <h2>🎯 관리자 전용 페이지</h2>
      </div>

      {/* ✅ 신고 리스트 컴포넌트 추가 */}
      <div className="mt-8">
        <AdminReportList />
      </div>
    </div>
  );
}
