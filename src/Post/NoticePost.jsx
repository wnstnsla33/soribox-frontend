import React, { useEffect, useState } from "react";
import axios from "axios";
import { Viewer } from "@toast-ui/react-editor";
import { useNavigate } from "react-router-dom";
export default function NoticePost() {
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    axios
      .get(`${BASE_URL}/post/notice`, { withCredentials: true })
      .then((res) => {
        setNotices(res.data.data); // PostListDTO[]
        console.log(res.data.message);
      })
      .catch((err) => {
        console.error("공지 불러오기 실패:", err);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">📢 공지사항</h2>
      <ul className="space-y-4">
        {notices.map((notice) => (
          <li
            onClick={() => {
              navigate(`/post/${notice.postId}`);
            }}
            key={notice.postId}
            className="border p-4 rounded-lg shadow hover:bg-gray-50 border p-4 rounded-lg
             shadow transition-transform duration-200 hover:shadow-md hover:-translate-y-1 hover:bg-gray-50 cursor-pointer"
          >
            <h3 className="text-xl font-semibold">{notice.title}</h3>
            <p className="text-sm text-gray-600">
              작성자: {notice.userNickName} | 조회수: {notice.viewCount} | 댓글:{" "}
              {notice.replyCount}
            </p>
            <div className="mt-2">
              <Viewer initialValue={notice.content} />
            </div>

            <p className="text-sm text-gray-400 mt-1">
              작성일: {new Date(notice.createDate).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
