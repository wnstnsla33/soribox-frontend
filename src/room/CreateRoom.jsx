import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function CreateRoom() {
  const navigater = useNavigate();
  const [formData, setFormData] = useState({
    roomTitle: "",
    roomType: "Cafeteria",
    roomContent: "",
    maxParticipants: 10,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/chatRoom",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log("방 생성 성공:", response.data);
      navigater("/rooms");
      // 생성된 방으로 이동하거나 알림 띄우기
    } catch (error) {
      console.error("방 생성 실패:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-4">방 만들기</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">방 제목</label>
          <input
            type="text"
            name="roomTitle"
            value={formData.roomTitle}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">방 타입</label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Cafeteria">식당</option>
            <option value="Trip">여행지</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">방 소개</label>
          <textarea
            name="roomContent"
            value={formData.roomContent}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">최대 인원</label>
          <input
            type="number"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            min={1}
            max={100}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          방 생성
        </button>
      </form>
    </div>
  );
}
