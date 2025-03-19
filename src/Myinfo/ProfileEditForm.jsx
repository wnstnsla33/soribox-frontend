// src/components/ProfileEditForm.jsx
import { useRef } from "react";

export default function ProfileEditForm({ user, onUpdate }) {
  const nickNameRef = useRef(null);
  const imageRef = useRef(null);
  const userInfoRef = useRef(null);
  const newPasswordRef = useRef(null);
  const passwordRef = useRef(null);

  const isSNSUser = user?.userPassword == null;

  const handleSubmit = () => {
    const userData = {
      nickName: nickNameRef.current.value,
      userImg: imageRef.current.value,
      userInfo: userInfoRef.current.value,
      userNewPassword: newPasswordRef?.current?.value || "",
      userPassword: passwordRef?.current?.value || "",
    };
    onUpdate(userData, isSNSUser);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-2xl rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-8">프로필 수정</h2>

      {/* 이미지 */}
      <div className="flex items-center gap-6">
        <img
          src={user.userImg}
          ref={imageRef}
          alt="프로필 이미지"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
        />
        <input type="file" accept="image/*" className="block text-sm" />
      </div>

      {/* 닉네임 */}
      <div>
        <label className="block font-semibold mb-2">닉네임</label>
        <input
          type="text"
          ref={nickNameRef}
          defaultValue={user.userNickName}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
          required
        />
      </div>

      {/* 한 줄 소개 */}
      <div>
        <label className="block font-semibold mb-2">내 정보 (한 줄 소개)</label>
        <textarea
          rows="4"
          ref={userInfoRef}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
          placeholder="자기소개를 입력해 주세요."
          defaultValue={user.userInfo}
        />
      </div>

      {/* 비밀번호 변경 / 확인 → SNS 유저는 안 보임 */}
      {!isSNSUser && (
        <>
          <div>
            <label className="block font-semibold mb-2">
              비밀번호 변경 (선택)
            </label>
            <input
              type="password"
              ref={newPasswordRef}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
              placeholder="새 비밀번호를 입력하세요"
            />
          </div>

          <div className="mt-4 text-right">
            <label className="block font-semibold mb-2">
              현재 비밀번호 확인
            </label>
            <input
              type="password"
              ref={passwordRef}
              className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
              placeholder="현재 비밀번호를 입력하세요"
              required
            />
          </div>
        </>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-[#DED8CB] text-black rounded-lg hover:bg-[#c8c2b5] transition"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
