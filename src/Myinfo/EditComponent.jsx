export default function EditComponent({
  user,
  userImgref,
  nickNameRef,
  userInfoRef,
}) {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-2xl rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-8">프로필 수정</h2>

      {/* 이미지 */}
      <div className="flex items-center gap-6">
        <img
          ref={userImgref}
          src={user.userImg}
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
          value={user.nickName}
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
          value={user.info}
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
