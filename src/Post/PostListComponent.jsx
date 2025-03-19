import bookmark from "../img/bookmark.png";
import noBookmark from "../img/noBookmark.png";
import { Link } from "react-router-dom";
export default function PostLIstComponent({
  posts,
  userBookmarks,
  ClickBookmark,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
      {posts.map((post) => (
        <Link key={post.postId} to={`/post/${post.postId}`} state={{ post }}>
          <div
            key={post.postId}
            className="bg-white rounded-2xl shadow-lg overflow-hidden relative hover:shadow-2xl transition"
          >
            {/* 대표 이미지 */}
            <div className="relative h-60">
              <img
                src={`http://localhost:8080${post.titleImg}`}
                alt={post.title}
                className="w-full h-full object-cover"
              />

              {/* 북마크 이미지 (네가 넣고 싶은 이미지로 변경 가능) */}
              <img
                src={userBookmarks.has(post.postId) ? bookmark : noBookmark}
                alt="북마크"
                onClick={(e) => {
                  e.preventDefault(); // 클릭해도 Link 타고 상세페이지 안 가게 막아줌
                  ClickBookmark(post.postId);
                }}
                className="absolute top-2 right-2 w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
              />
            </div>

            {/* 제목 */}
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2 truncate">
                {post.title}+{post.bookmarkCount}
              </h3>

              {/* 작성자, 조회수 */}
              <div className="flex justify-between text-sm text-gray-500">
                <span>{post.userName}</span>
                <span>조회수 {post.viewCount}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
