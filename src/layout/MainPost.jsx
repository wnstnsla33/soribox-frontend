import { useEffect, useState } from "react";
import axios from "axios";
import PostListComponent from "../Post/PostListComponent";
export default function MainPost() {
  const [top10Post, setTop10Post] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState(new Set());
  const BASE_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const postRes = await axios.get(`${BASE_URL}/post/topView`, {
          withCredentials: true,
        });

        setTop10Post(postRes.data.data);
      } catch (err) {
        console.error("TopView 불러오기 실패:", err);
      }
    };
    fetchTopPosts();
  }, []);

  const toggleBookmark = async (postId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/post/bookmark/${postId}`,
        {},
        { withCredentials: true }
      );
      const updatedPost = res.data.data;
      setTop10Post((prevPosts) =>
        prevPosts.map((post) =>
          post.postId === updatedPost.postId
            ? {
                ...post,
                bookmarkCount: updatedPost.postBookmarkCount,
                bookmarked: updatedPost.bookmarked,
              }
            : post
        )
      );
      setUserBookmarks((prev) => {
        const updated = new Set(prev);
        updatedPost.bookmarked ? updated.add(postId) : updated.delete(postId);
        return updated;
      });
    } catch (err) {
      console.error("북마크 실패:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">🔥 인기 게시글 Top 10</h2>
      <PostListComponent
        posts={top10Post}
        userBookmarks={userBookmarks}
        ClickBookmark={toggleBookmark}
      />
    </div>
  );
}
