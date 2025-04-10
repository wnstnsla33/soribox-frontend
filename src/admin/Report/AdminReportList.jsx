// src/admin/AdminReportList.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import StatusChangeModal from "./StatusChangeModal";
import { useNavigate } from "react-router-dom";
export default function AdminReportList() {
  const [reports, setReports] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/reports", {
        params: { keyword, status, page },
        withCredentials: true,
      });
      setReports(res.data.data.data);
      setPageCount(res.data.data.pageCount);
    } catch (err) {
      console.error("신고 목록 조회 실패", err);
      alert("신고 목록 조회 중 오류 발생");
    }
  };

  useEffect(() => {
    fetchReports();
  }, [keyword, status, page]);

  const handleStatusClick = (report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const handleStatusUpdated = () => {
    setModalOpen(false);
    fetchReports();
  };

  return (
    <div className="p-4 text-left">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="작성자 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="">전체 상태</option>
          <option value="PENDING">PENDING</option>
          <option value="REJECTED">REJECTED</option>
          <option value="ACCEPT">ACCEPT</option>
        </select>
      </div>

      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 w-24">피신고자</th>
            <th className="border px-2 py-1 w-20">신고 타입</th>
            <th className="border px-2 py-1 w-auto">사유</th>
            <th className="border px-2 py-1 w-20">상태</th>
            <th className="border px-2 py-1 w-32">날짜</th>
            <th className="border px-2 py-1 w-20">관리</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((r) => (
              <tr
                onClick={() => {
                  navigate(`/admin/report/${r.reportId}`);
                }}
                className="hover:bg-gray-100 cursor-pointer transition"
                key={r.reportId}
              >
                <td className="border px-2 py-1">{r.reportedUserNickName}</td>
                <td className="border px-2 py-1">{r.targetType}</td>
                <td className="border px-2 py-1">{r.reason}</td>
                <td className="border px-2 py-1">{r.status}</td>
                <td className="border px-2 py-1">
                  {dayjs(r.createdAt).format("YYYY-MM-DD HH:mm")}
                </td>
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ 상세페이지 이동 방지
                      handleStatusClick(r);
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    상태 변경
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                신고 내역이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-3 py-1 rounded ${
              page === i ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {modalOpen && (
        <StatusChangeModal
          report={selectedReport}
          onClose={() => setModalOpen(false)}
          onSuccess={handleStatusUpdated}
        />
      )}
    </div>
  );
}
