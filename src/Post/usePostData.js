import { useState, useEffect } from "react";
import axios from "axios";

export default function usePostData(showBookmarksOnly, sortType) {
  const [posts, setPosts] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState(new Set());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (pageNum) => {
    try {
      const url = showBookmarksOnly
        ? `http://localhost:8080/post/mybookmark?page=${pageNum}&sortType=${sortType}`
        : `http://localhost:8080/post?page=${pageNum}&sortType=${sortType}`;
      console.log(url);
      const postRes = await axios.get(url, { withCredentials: true });
      const bookmarkRes = await axios.get(
        "http://localhost:8080/post/bookmarkList",
        {
          withCredentials: true,
        }
      );
      setPosts(postRes.data.posts || []);
      setTotalPages(Math.ceil(postRes.data.postCount / 10) || 1);
      setUserBookmarks(new Set(bookmarkRes.data || []));
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
    fetchData(page);
  }, [page, showBookmarksOnly, sortType]); // showBookmarksOnly 바뀔 때마다 다시 불러옴

  const nextPage = () => {
    setPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const prevPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return {
    posts,
    userBookmarks,
    toggleBookmark,
    page,
    totalPages,
    nextPage,
    prevPage,
  };
}
