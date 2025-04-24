export default function SnsLoginButton() {
  const BASE_URL = process.env.REACT_APP_API_URL;
  const naverLogin = () => {
    window.location.href = `http://soribox.kro.kr/oauth2/authorization/naver
`;
  };

  const kakaoLogin = () => {
    window.location.href = `http://soribox.kro.kr/oauth2/authorization/kakao`;
  };

  const googleLogin = () => {
    window.location.href = `${BASE_URL}/oauth2/authorization/google`;
  };
  return (
    <div className="mt-4 flex justify-center space-x-2">
      <button
        onClick={googleLogin}
        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-100"
      >
        <img
          src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"
          alt="Google"
          className="w-6 h-6"
        />
      </button>

      <button
        onClick={kakaoLogin}
        className="w-10 h-10 flex items-center justify-center bg-yellow-300 border border-yellow-400 rounded-full hover:bg-yellow-400"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg"
          alt="Kakao"
          className="w-6 h-6"
        />
      </button>

      <button
        onClick={naverLogin}
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
