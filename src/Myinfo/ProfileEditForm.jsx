import { useRef, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ProfileEditForm({ user, onUpdate }) {
  const nickNameRef = useRef(null);
  const userInfoRef = useRef(null);
  const newPasswordRef = useRef(null);
  const passwordRef = useRef(null);
  const birthRef = useRef(null);

  const [location, setLocation] = useState({
    sido: user?.sido || "",
    sigungu: user?.sigungu || "",
  });

  const [image, setImage] = useState({
    file: null,
    preview: user.userImg,
  });

  const isSNSUser =
    user?.userEmail?.startsWith("naver") ||
    user?.userEmail?.startsWith("google") ||
    user?.userEmail?.startsWith("kakao");

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setLocation({
          sido: data.sido || "",
          sigungu: data.sigungu || "",
        });
      },
    }).open();
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    maxFiles: 1,
  });

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("nickName", nickNameRef.current.value);
    formData.append("userInfo", userInfoRef.current.value);
    formData.append("userNewPassword", newPasswordRef?.current?.value || "");
    formData.append("userPassword", passwordRef?.current?.value || "");
    formData.append("sido", location.sido);
    formData.append("sigungu", location.sigungu);

    if (!user.userBirthDay && birthRef.current?.value) {
      formData.append("birthDay", birthRef.current.value); // ISO 날짜 문자열
    }

    if (image.file) {
      formData.append("userImg", image.file);
    }

    onUpdate(formData, isSNSUser);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-2xl rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-8">프로필 수정</h2>

      {/* 프로필 이미지 업로드 */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">프로필 이미지</label>
        <div
          {...getRootProps()}
          className={`flex items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer ${
            isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {image.preview ? (
            <img
              src={image.preview}
              alt="preview"
              className="w-32 h-32 object-cover rounded-full border-4 border-gray-300"
            />
          ) : (
            <p className="text-gray-400">이미지를 클릭하거나 드래그하세요</p>
          )}
        </div>
      </div>

      {/* 닉네임 */}
      <div className="mb-4">
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
      <div className="mb-4">
        <label className="block font-semibold mb-2">내 정보 (한 줄 소개)</label>
        <textarea
          rows="4"
          ref={userInfoRef}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
          placeholder="자기소개를 입력해 주세요."
          defaultValue={user.userInfo}
        />
      </div>

      {/* 생년월일 (userBirthDay가 없을 경우만 표시) */}
      {!user.userBirthDay && (
        <div className="mb-4">
          <label className="block font-semibold mb-2">생년월일</label>
          <input
            type="date"
            ref={birthRef}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
          />
        </div>
      )}

      {/* 거주 지역 */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">거주 지역</label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={`${location.sido} ${location.sigungu}`}
            className="flex-1 p-3 border rounded-lg bg-gray-100"
            placeholder="주소를 검색하세요"
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

      {/* 비밀번호 변경 / 확인 */}
      {!isSNSUser && (
        <>
          <div className="mb-4">
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
