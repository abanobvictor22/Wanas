import React, { useContext } from "react";
import PostCard from "../../componatns/postCard/PostCard";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../componatns/context/AuthContext";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function PostDetails() {
  const { token, userData } = useContext(AuthContext);
  const { id } = useParams();

  async function getAllComment() {
    const res = await axios.get(
      `https://route-posts.routemisr.com/posts/${id}/comments`,
      {
        headers: {
          token: token,
        },
      },
    );

    return res.data.data.comments || [];
  }
  console.log(id);

  const { data: comments } = useQuery({
    queryKey: ["allComment"],
    queryFn: () => {
      return getAllComment();
    },
  });

  async function getPost() {
    const res = await axios.get(
      `https://route-posts.routemisr.com/posts/${id}`,
      {
        headers: {
          token: token,
        },
      },
    );
    return res.data.data;
  }

  const { data: spost, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => {
      return getPost();
    },
  });
  const likes = spost?.post?.likes || [];
  const isUserLiked = likes.some((like) => like == userData?._id);

  return (
    <PostCard
      post={spost}
      loading={isLoading}
      isTop={false}
      comments={comments}
      isUserLike={isUserLiked}
    />
  );
}
