import React, { useState } from "react";
import CommentCard from "../commentCard/CommentCard";
import { Link, useNavigate } from "react-router-dom";
import CardPostLoading from "../cardPostLoading/CardPostLoading";
import CreateComment from "../createComment/CreateComment";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import toast from "react-hot-toast";
import { formatTimeAgo } from "../../utilities/handlingTime";

export default function PostCard({
  spost,
  post: propPost,
  comments = [],
  isTop,
  loading,
  isUserLike,
}) {
  const rawData = propPost || spost || {};
  const post = rawData.post || rawData;
  const { token } = useContext(AuthContext);
  const query = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [option, setOption] = useState(false);
  const [viewComment, setViewComment] = useState(false);
  let content = post?.body;
  const [isExpanded, setIsExpanded] = useState(false);
  const maxContentPost = 150;
  const isContentLong = content?.length > maxContentPost;
  const displayedText =
    isContentLong && !isExpanded
      ? content.slice(0, maxContentPost) + "....."
      : content;

  function toggleOption() {
    setOption(!option);
  }
  const id = post?._id || post.id;
  function setLike() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${id}/like`,
      {},
      {
        headers: {
          token: token,
        },
      },
    );
  }
  const { mutate } = useMutation({
    mutationFn: setLike,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["AllPosts"] });
      query.invalidateQueries({ queryKey: ["post", id] });
      query.invalidateQueries({ queryKey: ["likes", id] });
    },
  });
  function sharePost() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${id}/share`,
      {},
      {
        headers: {
          token: token,
        },
      },
    );
  }

  const { mutate: handelShare } = useMutation({
    mutationFn: sharePost,
    onSuccess: (data) => {
      toast.success(data.data.message);
      query.invalidateQueries({ queryKey: ["AllPosts"] });
      query.invalidateQueries({ queryKey: ["post", id] });
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Error sharing post"),
  });

  function getLikes() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${id}/likes?page=1&limit=20`,
      {
        headers: {
          token: token,
        },
      },
    );
  }

  const { data: userLike } = useQuery({
    queryKey: ["likes", id],
    queryFn: () => getLikes(),
    enabled: !!id,
  });

  function getReply() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${id}/comments/${post?.topComment?._id}/replies?page=1&limit=10`,
      {
        headers: {
          token: token,
        },
      },
    );
  }

  const { data: reply } = useQuery({
    queryKey: ["reply", id],
    queryFn: () => getReply(),
    enabled: Boolean(post?.topComment?._id),
  });

  if (loading) {
    return (
      <div className="mt-20">
        <CardPostLoading />
      </div>
    );
  }

  // const { data } = useQuery({
  //   queryKey: ["allComment"],
  //   queryFn: () => {
  //     return axios.get(
  //       `https://route-posts.routemisr.com/posts/${post._id}/comments?page=1&limit=10`,
  //       {
  //         headers: {
  //           token: token,
  //         },
  //       },
  //     );
  //   },
  //   enabled: viewComment,
  // });
  return (
    <div className={isTop ? "" : "mt-20"}>
      <div className="shadow-2xl max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto bg-white rounded-3xl p-5 md:p-7 lg:p-8  border border-slate-100 my-6 md:my-8">
        {/* Header: معلومات الكاتب والتاريخ */}
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <div className="flex items-center gap-3 md:gap-4">
            <img
              src={post?.user?.photo || post?.post?.user?.photo}
              alt="Avatar"
              className=" w-11 h-11 md:w-13 md:h-13 rounded-full bg-slate-100 object-cover border border-purple-100"
            />
            <div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base hover:text-purple-700 cursor-pointer transition-colors">
                {post?.user?.name || post?.post?.name}
              </h3>
              <p className=" text-xs md:text-sm text-slate-400 font-medium">
                {formatTimeAgo(post.createdAt)}
              </p>
            </div>
          </div>

          {/* زر الخيارات */}
          <button
            onClick={() => {
              toggleOption();
            }}
            className={`${isTop ? "" : "hidden"} relative text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer`}
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
            <div
              className={`absolute right-0  mt-2 w-40 bg-white rounded-lg shadow-md border py-1 z-50 ${option ? "" : "hidden"}`}
            >
              <Link
                to={`/postDetails/${id}`}
                state={post}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Post Details
              </Link>
            </div>
          </button>
        </div>

        {/* محتوى البوست النصي */}
        <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-4 md:mb-5 wrap-break-word">
          {displayedText}
          {isContentLong && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-purple-600 ml-1.5 font-semibold text-xs mt-1 cursor-pointer hover:underline"
            >
              {isExpanded ? "See Less" : "See More"}
            </button>
          )}
        </p>

        {post.sharedPost && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-5">
            {/* 1️⃣ رأس المشاركة (الشخص اللي عمل Share بالإنجليزية) */}
            <div className="flex items-center gap-2 mb-3 text-gray-500 text-sm font-medium">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              {/* اسم الشخص اللي عمل الشير بيتحط مكان  */}
              <span>{post?.user?.name} shared a post</span>
            </div>

            {/* 2️⃣ صندوق البوست الأصلي (المُشارك) - بدون مسافة إضافية قبله */}
            <Link to={`/postDetails/${post.sharedPost?._id}`}>
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                {/* صاحب البوست الأصلي */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={post?.sharedPost?.user?.photo}
                    alt="Original User"
                    className="w-10 h-10 rounded-full "
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {post?.sharedPost?.user?.name}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(post.sharedPost.createdAt)}
                    </span>
                  </div>
                </div>

                {/* محتوى البوست الأصلي */}
                <p className="text-gray-700 text-sm mb-3">
                  {post?.sharedPost?.body}
                </p>

                {/* صورة البوست الأصلي (اختياري) */}
                <div
                  className={`w-full h-48 bg-gray-200 rounded-lg overflow-hidden ${post?.sharedPost?.image ? "" : "hidden"}`}
                >
                  <img
                    src={post?.sharedPost?.image}
                    alt="Post media"
                    className={`w-full h-full object-contain `}
                  />
                </div>
              </div>
            </Link>
          </div>
        )}
        {/* صورة البوست */}
        {(post?.image || post?.post?.image) && (
          <div className=" rounded-2xl overflow-hidden mb-4 md:mb-5 border border-slate-100 bg-slate-50">
            <img
              src={post?.image || post?.post?.image}
              alt="Post content"
              className=" w-full h-64 md:h-80 lg:h-96 object-contain hover:scale-[1.01] transition-transform duration-300"
            />
          </div>
        )}
        {/* إحصائيات التفاعل */}
        <div className="flex items-center justify-between text-xs md:text-sm text-slate-400 pb-3 md:pb-4 border-b border-slate-100 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-2xs md:text-xs">
              ❤️
            </span>
            <div className="relative group inline-block cursor-pointer">
              {/* 1. النص الأساسي لعدد اللايكات */}
              <span className="hover:underline font-medium text-slate-600">
                {post?.likesCount || post?.post?.likesCount || 0} Likes
              </span>

              {/* 2. القائمة المنبثقة (Popup) */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 transition-all duration-200">
                <p className="text-xs font-bold text-slate-400 border-b border-slate-100 pb-1.5 mb-2">
                  Liked by
                </p>

                {/* قائمة المستخدمين مع سكرول إذا كان العدد كبيرًا */}
                <div className="max-h-44 overflow-y-auto space-y-2.5 pr-1">
                  {userLike?.data?.data?.likes?.length > 0 ? (
                    (userLike?.data?.data?.likes).map((user) => (
                      <div
                        key={user.id || user._id}
                        className="flex items-center gap-2.5"
                      >
                        <img
                          src={user?.photo}
                          alt={user?.name}
                          className="w-6 h-6 rounded-full object-cover border border-slate-100"
                        />
                        <span className="text-xs font-semibold text-slate-700 truncate">
                          {user?.name || "User"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-1">
                      No likes yet
                    </p>
                  )}
                </div>

                {/* سهم الـ Tooltip من الأسفل */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className={`${post?.commentsCount > 0 ? "cursor-pointer text-purple-600" : ""}`}
              onClick={() => {
                post?.commentsCount > 0
                  ? setViewComment(!viewComment)
                  : console.log("اصغر");
              }}
            >
              {post?.commentsCount || post.post?.commentsCount || 0} Comments
            </button>
            <span>•</span>
            <span>
              {post?.sharesCount || post.post?.sharesCount || 0} Shares
            </span>
          </div>
        </div>
        {isTop && post?.topComment && (
          <CommentCard
            replyCount={reply?.data?.data?.replies?.length}
            comment={post?.topComment}
            idComment={post?.topComment?._id}
            idPost={id}
          />
        )}
        {/* {!isTop &&
          comments.map((comment) => {
            return (
              <CommentCard
                key={comment?._id}
                comment={comment}
                idComment={comment?._id}
                idPost={id}
              />
            );
          })} */}
        {viewComment &&
          comments.map((comment) => {
            return (
              <CommentCard
                key={comment?._id}
                comment={comment}
                idComment={comment?._id}
                idPost={id}
              />
            );
          })}
        {/* أزرار التفاعل */}
        <div className="flex items-center justify-between pt-2 md:pt-3 gap-2">
          <button
            onClick={() => mutate()}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm md:text-base font-semibold transition-colors cursor-pointer ${
              isUserLike
                ? "text-purple-700 bg-purple-50"
                : "text-slate-500 hover:bg-slate-50 hover:text-purple-600"
            }`}
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill={isUserLike ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            Like
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm md:text-base font-semibold text-slate-500 hover:bg-slate-50 hover:text-purple-600 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Comment
          </button>

          <button
            onClick={() => handelShare()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm md:text-base font-semibold text-slate-500 hover:bg-slate-50 hover:text-purple-600 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share
          </button>
        </div>
        <div className={showComments ? "" : "hidden"}>
          <CreateComment id={id} />
        </div>
      </div>
    </div>
  );
}
