import axios from "axios";
import { useState } from "react";
import { useSpring, animated } from "react-spring";

export default function ReplyLikeButton({ replyId, liked, likeCount }) {
  const BASE_URL = process.env.REACT_APP_API_URL;
  const [isLiked, setIsLiked] = useState(liked);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [loading, setLoading] = useState(false);

  const { number } = useSpring({
    from: { number: currentLikeCount },
    number: currentLikeCount,
    config: { tension: 210, friction: 20 },
  });

  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/reply/like/${replyId}`,
        {},
        { withCredentials: true }
      );
      const { likeCount: updatedCount, liked: updatedLiked } = res.data.data;
      setIsLiked(updatedLiked);
      setCurrentLikeCount(updatedCount);
    } catch (err) {
      alert("좋아요 처리 중 오류 발생!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button onClick={toggleLike} className="text-lg" disabled={loading}>
        {isLiked ? (
          <span className="text-red-500">❤️</span>
        ) : (
          <span className="text-gray-400">🤍</span>
        )}
      </button>
      <animated.span className="text-sm text-gray-700">
        {number.to((n) => Math.round(n))}
      </animated.span>
    </div>
  );
}
