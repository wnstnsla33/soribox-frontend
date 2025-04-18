import { useState, useEffect } from "react";
import axios from "axios";

export default function usePostData(showBookmarksOnly, sortType, keyword) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const BASE_URL = process.env.REACT_APP_API_URL;
  const fetchData = async (pageNum) => {
    try {
      const url = showBookmarksOnly
        ? `${BASE_URL}/post/mybookmark?page=${pageNum}&sortType=${sortType}&keyword=${keyword}`
        : `${BASE_URL}/post?page=${pageNum}&sortType=${sortType}&keyword=${keyword}`;
      const postRes = await axios.get(url, { withCredentials: true });
      setPosts(postRes.data.data.posts || []);
      setTotalPages(Math.ceil(postRes.data.data.postCount) || 1);
      console.log(postRes);
    } catch (err) {
      console.error("불러오기 실패:", err);
    }
  };

  const toggleBookmark = async (postId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/post/bookmark/${postId}`,
        {},
        { withCredentials: true }
      );
      const updatedPost = res.data.data;

      setPosts((prevPosts) =>
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
    } catch (err) {
      console.error("북마크 실패:", err);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page, showBookmarksOnly, sortType, keyword]);

  const nextPage = () => {
    setPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const prevPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return {
    posts,
    toggleBookmark,
    page,
    totalPages,
    nextPage,
    prevPage,
    setPage, // keyword 바뀔 때 page 1로 리셋할 때 사용
  };
}
