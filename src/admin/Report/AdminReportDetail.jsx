import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function AdminReportDetail() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/admin/reports/${reportId}`,
          { withCredentials: true }
        );
        setReport(res.data.data);
      } catch (err) {
        console.error("신고 상세 조회 실패", err);
        alert("신고 상세 조회 중 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  if (loading) return <div className="p-4 text-center">로딩 중...</div>;
  if (!report)
    return (
      <div className="p-4 text-center text-red-500">
        신고 내역을 찾을 수 없습니다.
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        📄 신고 상세 정보
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <DetailItem
          label="신고자"
          value={
            <ClickableText
              text={`${report.reporterNickName} (ID: ${report.reporterId})`}
              onClick={() => navigate(`/admin/users/${report.reporterId}`)}
            />
          }
        />
        <DetailItem
          label="피신고자"
          value={
            <ClickableText
              text={`${report.reportedUserNickName} (ID: ${report.reportedUserId})`}
              onClick={() => navigate(`/admin/users/${report.reportedUserId}`)}
            />
          }
        />
        <DetailItem
          label="신고 대상"
          value={
            <ClickableText
              text={`${report.targetType} - ${report.targetId}`}
              onClick={() => {
                const target = report.targetType;
                if (target === "POST")
                  navigate(`/admin/post/${report.targetId}`);
                else if (target === "ROOM")
                  navigate(`/admin/rooms/${report.targetId}`);
                else if (target === "CHAT")
                  navigate(`/admin/rooms/${report.parentId}`);
                else if (target === "REPLY")
                  navigate(`/admin/post/${report.parentId}`);
              }}
            />
          }
        />

        <DetailItem
          label="신고 시간"
          value={dayjs(report.createdAt).format("YYYY-MM-DD HH:mm")}
        />
        <DetailItem
          label="누적 신고 횟수 (피신고자)"
          value={report.reportedCount}
        />
      </div>

      {(report.targetType === "CHAT" || report.targetType === "REPLY") && (
        <div className="mt-6">
          <h3 className="font-semibold text-red-600 mb-1">🚨 신고된 내용</h3>
          <p className="p-3 bg-red-50 border border-red-300 rounded-md text-sm text-gray-800 whitespace-pre-wrap">
            {report.chatText}
          </p>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-semibold text-gray-800 mb-1">📝 신고 사유</h3>
        <p className="p-3 bg-gray-100 border rounded-md text-gray-700 whitespace-pre-wrap">
          {report.reason}
        </p>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-500 font-medium mb-1">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}

function ClickableText({ text, onClick }) {
  return (
    <span
      onClick={onClick}
      className="text-blue-500 hover:underline cursor-pointer"
    >
      {text}
    </span>
  );
}
