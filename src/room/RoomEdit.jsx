import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import RoomTypeSelector from "./RoomTypeSelector";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

export default function RoomEdit() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef();
  const BASE_URL = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    content: "",
    maxParticipants: 10,
    meetingTime: new Date(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 방 정보 불러오기
  const fetchRoomInfo = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chatRoom/edit/${roomId}`, {
        withCredentials: true,
      });
      const data = res.data.data;
      setFormData({
        title: data.title,
        type: data.type,
        content: data.content,
        maxParticipants: data.maxParticipants,
        meetingTime: new Date(data.meetingTime),
      });
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.getInstance().setHTML(data.content);
        }
      }, 0);
    } catch (err) {
      alert("방 정보를 불러오지 못했습니다.");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchRoomInfo();
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const html = editorRef.current.getInstance().getHTML();

    const updateData = {
      roomTitle: formData.title,
      roomType: formData.type,
      roomContent: html,
      maxParticipants: formData.maxParticipants,
      meetingTime: formData.meetingTime
        .toLocaleString("sv-SE")
        .replace(" ", "T"),
    };

    setIsSubmitting(true);
    try {
      const res = await axios.put(
        `${BASE_URL}/chatRoom/edit/${roomId}`,
        updateData,
        { withCredentials: true }
      );
      alert(res.data.message);
      navigate(`/room/${roomId}`);
    } catch (err) {
      const message =
        err.response?.data?.message || "방 수정 중 문제가 발생했습니다.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">방 정보 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 제목 */}
        <div>
          <label className="block mb-1 font-semibold">방 제목</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
            placeholder="방 이름을 입력하세요"
          />
        </div>

        {/* 방 타입 */}
        <RoomTypeSelector
          selectedType={formData.type}
          onChange={(type) => setFormData((prev) => ({ ...prev, type }))}
        />

        {/* 소개 */}
        <div>
          <label className="block font-semibold mb-1">방 소개</label>
          <Editor
            ref={editorRef}
            previewStyle="vertical"
            height="300px"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            initialValue={formData.content}
          />
        </div>

        {/* 인원 수 */}
        <div>
          <label className="block font-semibold mb-1">최대 인원</label>
          <input
            type="number"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            min={1}
            max={100}
            className="w-full border p-3 rounded"
          />
        </div>

        {/* 시간 */}
        <div>
          <label className="block font-semibold mb-1">약속 시간</label>
          <DatePicker
            selected={formData.meetingTime}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, meetingTime: date }))
            }
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={10}
            dateFormat="yyyy-MM-dd HH:mm"
            className="w-full border p-3 rounded"
          />
        </div>

        {/* 제출 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded text-white transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isSubmitting ? "수정 중..." : "수정 완료"}
        </button>
        {errorMessage && (
          <p className="text-red-500 font-medium text-center mt-2">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}
