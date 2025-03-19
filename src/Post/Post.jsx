import React from "react";
import usePostData from "./usePostData";
import PostListComponent from "./PostListComponent";

export default function Post() {
  const { posts, userBookmarks, toggleBookmark } = usePostData();

  return (
    <PostListComponent
      posts={posts}
      userBookmarks={userBookmarks}
      ClickBookmark={toggleBookmark}
    />
  );
}
