import React, { useState } from "react";
import ReportModal from "./ReportModal";

export default function ReportButton({ targetId, targetType, reportedUserId }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-red-500 hover:underline text-xs"
      >
        신고
      </button>
      <ReportModal
        isOpen={open}
        onClose={() => setOpen(false)}
        targetId={targetId}
        targetType={targetType}
        reportedUserId={reportedUserId}
      />
    </>
  );
}
