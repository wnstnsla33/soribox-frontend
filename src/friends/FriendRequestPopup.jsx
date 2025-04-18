import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function FriendRequestPopup({ onClose }) {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const observer = useRef();
  const BASE_URL = process.env.REACT_APP_API_URL;
  const loadRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/friends/request`, {
        params: { page },
        withCredentials: true,
      });

      const data = res.data.data;
      setRequests((prev) => [...prev, ...data.content]);
      setLastPage(data.last);
    } catch (err) {
      console.error("친구 요청 목록 불러오기 실패", err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [page]);

  const lastRequestRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !lastPage) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [lastPage]
  );

  const respondToFriend = async (fid, actionType) => {
    try {
      const res = await axios.put(`${BASE_URL}/friends/${fid}`, actionType, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      toast.success(res.data.message);
      setRequests((prev) => prev.filter((r) => r.fid !== fid));
    } catch (err) {
      toast.error(err.response?.data?.message || "처리 실패");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-[400px] max-h-[500px] overflow-auto rounded-lg shadow-lg p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-3">친구 요청</h2>

        {requests.map((req, index) => (
          <div
            key={req.fId}
            ref={index === requests.length - 1 ? lastRequestRef : null}
            className="border-b py-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img
                  src={`${BASE_URL}${req.friendsImg}`}
                  alt="img"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p className="font-semibold">{req.friendsNickName}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => respondToFriend(req.fid, "ACCEPT")}
                  className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  수락
                </button>
                <button
                  onClick={() => respondToFriend(req.fid, "DENIED")}
                  className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  거절
                </button>
              </div>
            </div>
          </div>
        ))}

        {lastPage && (
          <p className="text-center text-sm text-gray-400 mt-4">
            마지막 요청입니다.
          </p>
        )}
      </div>
    </div>
  );
}
