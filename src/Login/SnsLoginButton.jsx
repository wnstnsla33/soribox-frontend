export default function SnsLoginButton() {
  const naverLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/naver";
  };
  return (
    <div className="mt-4 flex justify-center space-x-2">
      <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-100">
        <img
          src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"
          alt="Google"
          className="w-6 h-6"
        />
      </button>

      <button className="w-10 h-10 flex items-center justify-center bg-yellow-300 border border-yellow-400 rounded-full hover:bg-yellow-400">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg"
          alt="Kakao"
          className="w-6 h-6"
        />
      </button>

      <button
        onClick={() => naverLogin()}
        className="w-10 h-10 flex items-center justify-center bg-green-500 border border-green-600 rounded-full hover:bg-green-600"
      >
        <img
          src="https://littledeep.com/wp-content/uploads/2020/09/naver-icon-style.png"
          alt="Naver"
          className="w-6 h-6"
        />
      </button>
    </div>
  );
}
