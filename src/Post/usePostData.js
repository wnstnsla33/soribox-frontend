import { useState, useEffect } from "react";
import axios from "axios";

export default function usePostData() {
  const [posts, setPosts] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState(new Set());

  const fetchData = async () => {
    try {
      const [postRes, bookmarkRes] = await Promise.all([
        axios.get("http://localhost:8080/post", { withCredentials: true }),
        axios.get("http://localhost:8080/post/bookmark", {
          withCredentials: true,
        }),
      ]);
      setPosts(postRes.data);
      setUserBookmarks(new Set(bookmarkRes.data));
    } catch (err) {
      console.error("불러오기 실패:", err);
    }
  };

  const toggleBookmark = async (postId) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/post/bookmark/${postId}`,
        {},
        { withCredentials: true }
      );
      const updatedPost = res.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postId === updatedPost.postId
            ? { ...post, bookmarkCount: updatedPost.postBookmarkCount }
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

  useEffect(() => {
    fetchData();
  }, []);

  return { posts, userBookmarks, toggleBookmark };
}
