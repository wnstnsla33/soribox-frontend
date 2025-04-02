import { useRef, useState } from "react";

export default function EditComponent({
  user,
  userImgRef,
  nickNameRef,
  userInfoRef,
}) {
  const [preview, setPreview] = useState(user.userImg);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    userImgRef.current = file; // 파일 자체를 ref에 저장
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-2xl rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-8">프로필 수정</h2>

      {/* 이미지 */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={preview}
          alt="프로필 이미지"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block text-sm"
        />
      </div>

      {/* 닉네임 */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">닉네임</label>
        <input
          type="text"
          ref={nickNameRef}
          defaultValue={user.nickName}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
          required
        />
      </div>

      {/* 한 줄 소개 */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">내 정보 (한 줄 소개)</label>
        <textarea
          rows="4"
          ref={userInfoRef}
          defaultValue={user.info}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
          placeholder="자기소개를 입력해 주세요."
        />
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-3 bg-[#DED8CB] text-black rounded-lg hover:bg-[#c8c2b5] transition">
          저장하기
        </button>
      </div>
    </div>
  );
}
