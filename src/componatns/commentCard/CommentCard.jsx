import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { formatTimeAgo } from "../../utilities/handlingTime";
import ReplyCard from "../replyCard/ReplyCard";
import CreateReply from "../createReply/CreateReply";
import { useState } from "react";

export default function CommentCard({
  topComment,
  comment,
  idComment,
  idPost,
}) {
  const { userData, token } = useContext(AuthContext);
  const query = useQueryClient();
  const [toggleReply, setToggleReply] = useState(false);
  console.log(toggleReply);

  const isUserLikedComment = comment.likes.some((like) => {
    return like == userData._id;
  });

  function getReply() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${idPost}/comments/${idComment}/replies?page=1&limit=10`,
      {
        headers: {
          token: token,
        },
      },
    );
  }
  // console.log(comment);

  const { data } = useQuery({
    queryKey: ["reply", idComment, idPost],
    queryFn: () => getReply(),
    enabled: !!idComment,
  });
  console.log(data);

  function setLikeComment() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${idPost}/comments/${idComment}/like`,
      {},
      {
        headers: {
          token: token,
        },
      },
    );
  }

  const { data: setLikeCommentData, mutate } = useMutation({
    mutationKey: ["setLikeComment", idComment],
    mutationFn: () => setLikeComment(),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["allComment"] });
      query.invalidateQueries({ queryKey: ["AllPosts"] });
    },
  });

  return (
    <div className="flex items-start gap-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 my-2">
      {/* صورة صاحب التعليق */}
      <img
        src={comment?.commentCreator?.photo}
        alt="User Avatar"
        className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-purple-100 shrink-0"
      />

      {/* محتوى التعليق */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1 gap-2">
          <h4 className="font-bold text-slate-800 text-xs md:text-sm truncate">
            {comment?.commentCreator?.name}
          </h4>

          <span className="text-2xs md:text-xs text-slate-400 font-normal shrink-0">
            {formatTimeAgo(comment?.createdAt)}
          </span>
        </div>
        {/* نص التعليق */}
        <p className="text-slate-600 text-xs md:text-sm leading-relaxed wrap-break-word">
          {comment?.content}
        </p>
        {/* صورة التعليق (إن وجدت) */}
        {comment?.image && (
          <div className="mt-2.5 inline-block">
            <img
              src={comment?.image}
              alt="Comment attachment"
              className="h-28 md:h-36 w-auto max-w-full object-contain rounded-xl border border-slate-200/70 shadow-sm hover:brightness-95 hover:shadow-md transition-all duration-200 cursor-pointer"
            />
          </div>
        )}
        {/* 🌟 شريط التفاعل كامل (الأزرار يسار + العدادات يمين) */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-xs font-medium text-slate-500">
          {/* الأزرار (يسار) */}
          <div className="flex items-center gap-3.5">
            {/* زر Like */}
            <button
              onClick={() => mutate()}
              className={`flex items-center gap-1.5 hover:text-purple-600 transition-colors cursor-pointer ${
                isUserLikedComment
                  ? "text-purple-600 font-semibold"
                  : "text-slate-500 hover:text-purple-600"
              }`}
            >
              <svg
                className={`w-4 h-4 ${
                  isUserLikedComment
                    ? "fill-purple-600 stroke-purple-600"
                    : "fill-none stroke-currentColor"
                }`}
                fill="none"
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
              <span>Like</span>
            </button>

            {/* زر Reply */}
            <button
              onClick={() => setToggleReply(!toggleReply)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
              <span>Reply</span>
            </button>
          </div>

          {/* العدادات كاملة (يمين) */}
          <div className="flex items-center gap-3">
            {/* عداد اللايكات */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-4 h-4 rounded-full bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-[9px]">
                ❤️
              </span>
              <span className="text-slate-600 font-semibold">
                {comment?.likes?.length || 0} Likes
              </span>
            </div>

            {/* عداد الردود */}
          </div>
        </div>
        {data?.data?.data?.replies.length > 0 ? (
          <ReplyCard
            idPost={idPost}
            idComment={idComment}
            reply={data?.data?.data?.replies}
          />
        ) : (
          ""
        )}
        <div className={toggleReply ? "" : "hidden"}>
          <CreateReply
            idPost={idPost}
            idComment={idComment}
            commentCreator={comment?.commentCreator?.name}
          />
        </div>
      </div>
    </div>
  );
}
