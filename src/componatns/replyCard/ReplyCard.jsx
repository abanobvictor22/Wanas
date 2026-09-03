import React, { useContext } from "react";
import { formatTimeAgo } from "../../utilities/handlingTime";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "./../context/AuthContext";

export default function ReplyCard({ reply, idPost, idComment }) {
  const { token, userData } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const query = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["replyLike"],
    mutationFn: (repId) => {
      return axios.put(
        `https://route-posts.routemisr.com/posts/${idPost}/comments/${repId}/like`,
        {},
        {
          headers: {
            token: token,
          },
        },
      );
    },
    onSuccess: () => {
      console.log(idComment);

      query.invalidateQueries({
        queryKey: ["reply", idComment, idPost],
      });
    },
  });
  return (
    <div className="mt-2.5 ">
      {/* 🌟 Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-2.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors cursor-pointer py-1"
      >
        {/* Connector line */}
        <span className="w-4 h-0.5 bg-slate-300 group-hover:bg-purple-500 rounded-full transition-colors" />

        {/* Action text */}
        <span>
          {isOpen ? "Hide" : "View"} replies ({reply?.length || 0})
        </span>

        {/* Chevron Icon */}
        <svg
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-transform duration-200  ${isOpen ? "rotate-180" : ""} `}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* 💬 Replies Tree Container */}
      <div
        className={`mt-2 ml-2 pl-3.5 border-l-2 border-purple-100 flex flex-col gap-3 ${isOpen ? "" : "hidden"}`}
      >
        {/* Reply Items */}
        {reply?.map((rep) => {
          const isUserLikeReply = rep.likes.some((like) => {
            return like == userData._id;
          });
          return (
            <div
              key={rep._id || rep.id}
              className="flex items-start gap-2.5 p-2.5 bg-white/70 rounded-xl border border-slate-100 shadow-2xs"
            >
              <img
                src={rep.commentCreator?.photo}
                alt="User Avatar"
                className="w-7 h-7 rounded-full object-cover shrink-0 border border-purple-100"
              />
              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center justify-between mb-0.5">
                  <h5 className="font-bold text-slate-800 truncate">
                    {rep.commentCreator?.name}
                  </h5>
                  <span className="text-2xs text-slate-400">
                    {formatTimeAgo(rep.createdAt)}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed wrap-break-word">
                  {rep.content}
                </p>
                {rep?.image && (
                  <img
                    className="mt-2.5 h-24 md:h-32 w-auto max-w-full object-contain rounded-xl border border-slate-200/70 shadow-2xs hover:brightness-95 hover:shadow-md transition-all duration-200 cursor-pointer"
                    src={rep?.image}
                  />
                )}

                {/* 🌟 شريط التفاعل الخاص بالرد (زر اللايك + العداد) */}
                <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400">
                  <button
                    onClick={() => mutate(rep._id)}
                    className={`flex items-center gap-1.5 hover:text-purple-600 transition-colors cursor-pointer ${
                      isUserLikeReply
                        ? "text-purple-600 font-semibold"
                        : "text-slate-500 hover:text-purple-600"
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 ${
                        isUserLikeReply
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

                  {/* عداد اللايكات للرد */}
                  <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <span className="w-3.5 h-3.5 rounded-full bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-[7px]">
                      ❤️
                    </span>
                    <span>{rep.likesCount || 0} Likes</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
