import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../componatns/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import CardPostLoading from "../../componatns/cardPostLoading/CardPostLoading";
import PostCard from "../../componatns/postCard/PostCard";
import CreatePost from "../../componatns/createPost/CreatePost";
export default function Posts() {
  const { token, userData } = useContext(AuthContext);

  async function getPosts() {
    return axios
      .get("https://route-posts.routemisr.com/posts", {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        return res.data.data.posts;
      });
  }

  const { data, isError, isLoading } = useQuery({
    queryKey: ["AllPosts"],
    queryFn: () => {
      return getPosts();
    },
  });

  if (isLoading) {
    return (
      <div className="mt-30">
        <CardPostLoading />
        <CardPostLoading />
        <CardPostLoading />
      </div>
    );
  }

  return (
    <>
      <div className="mt-30">
        <CreatePost />
        {data &&
          data.map((post) => {
            const isMeLike = Boolean(
              post?.likes?.some(
                (like) => String(like?._id || like) === String(userData?._id),
              ),
            );

            return (
              <PostCard
                key={post._id}
                post={post}
                isTop={true}
                isUserLike={isMeLike}
              />
            );
          })}
      </div>
    </>
  );
}
