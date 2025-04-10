import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RoomTypeSelector from "./RoomTypeSelector";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

export default function CreateRoom() {
  const navigate = useNavigate();
  const editorRef = useRef();

  const [formData, setFormData] = useState({
    roomTitle: "",
    roomType: "",
    roomContent: "",
    maxParticipants: 10,
    sido: "",
    sigungu: "",
    dong: "",
    meetingTime: new Date(),
    secretePassword: "",
  });

  const [roomSaveImg, setRoomSaveImg] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setRoomSaveImg(e.target.files[0]);
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const parts = (data.roadAddress || data.jibunAddress || "").split(" ");
        setFormData((prev) => ({
          ...prev,
          sido: data.sido || parts[0] || "",
          sigungu: data.sigungu || parts[1] || "",
        }));
      },
    }).open();
  };

  const handleImageUpload = async (blob, callback) => {
    const form = new FormData();
    form.append("image", blob);

    try {
      const res = await axios.post(
        "http://localhost:8080/chatRoom/image",
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      const imageUrl = "http://localhost:8080" + res.data.data;
      callback(imageUrl, "대표 이미지");
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sido || !formData.sigungu)
      return alert("주소를 선택해주세요.");
    if (!formData.roomType) return alert("방 타입을 선택해주세요.");
    if (formData.meetingTime <= new Date())
      return alert("약속 시간은 현재 시간보다 이후여야 합니다.");
    if (formData.isPrivate && !formData.roomPassword)
      return alert("비밀방 비밀번호를 입력해주세요.");

    const html = editorRef.current.getInstance().getHTML();

    const fullForm = new FormData();
    fullForm.append("roomTitle", formData.roomTitle);
    fullForm.append("roomType", formData.roomType);
    fullForm.append("roomContent", html);
    fullForm.append("maxParticipants", formData.maxParticipants);
    fullForm.append(
      "meetingTime",
      formData.meetingTime.toLocaleString("sv-SE").replace(" ", "T")
    );
    fullForm.append("sido", formData.sido);
    fullForm.append("sigungu", formData.sigungu);
    fullForm.append("isPrivate", formData.isPrivate);
    if (formData.isPrivate) {
      fullForm.append("secretePassword", formData.roomPassword);
    }
    if (roomSaveImg) {
      fullForm.append("roomSaveImg", roomSaveImg);
    }

    try {
      const res = await axios.post("http://localhost:8080/chatRoom", fullForm, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert(res.data.message);
      navigate(`/room/${res.data.data.roomId}`);
    } catch (err) {
      console.error(err);
      alert(err.data.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">방 만들기</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 제목 */}
        <div>
          <label className="block mb-1 font-semibold">방 제목</label>
          <input
            name="roomTitle"
            value={formData.roomTitle}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
            placeholder="방 이름을 입력하세요"
          />
        </div>

        {/* 방 타입 */}
        <RoomTypeSelector
          selectedType={formData.roomType}
          onChange={(type) =>
            setFormData((prev) => ({ ...prev, roomType: type }))
          }
        />

        {/* 이미지 업로드 */}
        <div>
          <label className="block font-semibold mb-1">대표 이미지</label>
          <div className="flex items-center gap-4">
            {roomSaveImg ? (
              <img
                src={URL.createObjectURL(roomSaveImg)}
                alt="preview"
                className="w-24 h-24 object-cover rounded border"
              />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center border border-dashed border-gray-300 rounded text-gray-400 text-sm">
                No Image
              </div>
            )}
            <div>
              <label className="inline-block bg-white border px-4 py-2 rounded cursor-pointer hover:bg-gray-50">
                파일 선택
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="mt-2 text-xs text-gray-500">
                {roomSaveImg ? roomSaveImg.name : "jpg, png 파일 업로드"}
              </p>
            </div>
          </div>
        </div>

        {/* 소개 */}
        <div>
          <label className="block font-semibold mb-1">방 소개</label>
          <Editor
            ref={editorRef}
            previewStyle="vertical"
            height="300px"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            hooks={{ addImageBlobHook: handleImageUpload }}
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

        {/* 지역 */}
        <div>
          <label className="block font-semibold mb-1">모임 지역</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={`${formData.sido} ${formData.sigungu}`}
              className="flex-1 border p-3 rounded bg-gray-100"
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              주소 검색
            </button>
          </div>
        </div>

        {/* 비밀방 체크 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPrivate"
            name="isPrivate"
            checked={formData.isPrivate}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="isPrivate" className="font-semibold">
            비밀방
          </label>
        </div>

        {/* 비밀번호 입력 */}
        {formData.isPrivate && (
          <div>
            <label className="block font-semibold mb-1">비밀번호</label>
            <input
              type="password"
              name="roomPassword"
              value={formData.roomPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              placeholder="비밀번호 입력"
            />
          </div>
        )}

        {/* 제출 */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600"
        >
          방 생성
        </button>
      </form>
    </div>
  );
}
