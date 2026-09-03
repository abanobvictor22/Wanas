import React, { useContext, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { AuthContext } from "./../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function CreateReply({ idComment, idPost, commentCreator }) {
  const { userData, token } = useContext(AuthContext);
  const [convertImg, setConvertImg] = useState(null);
  const query = useQueryClient();
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      content: `@${commentCreator} `,
      image: "",
    },
  });

  function prepareImg(e) {
    const image = URL.createObjectURL(e?.target?.files[0]);
    setConvertImg(image);
  }

  function prepareData(data) {
    let formData = new FormData();
    if (data?.content) {
      formData.append("content", data?.content);
    }
    if (data?.image?.[0]) {
      formData.append("image", data?.image?.[0]);
    }
    mutate(formData);
  }

  const { mutate } = useMutation({
    mutationKey: ["setReply"],
    mutationFn: (formData) => {
      return axios.post(
        `https://route-posts.routemisr.com/posts/${idPost}/comments/${idComment}/replies`,
        formData,
        {
          headers: {
            token: token,
          },
        },
      );
    },
    onSuccess: (res) => {
      console.log(res);
      setValue("image", "");
      setValue("content", "");
      setConvertImg(null);
      query.invalidateQueries({ queryKey: ["reply", idComment, idPost] });
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });
  return (
    <form onSubmit={handleSubmit(prepareData)}>
      <div className="mt-3 flex items-start gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-200 transition-all focus-within:bg-white focus-within:shadow-sm focus-within:border-purple-300">
        {/* صورة المستخدم (Avatar) */}
        <img
          src={userData.photo}
          alt="User Avatar"
          className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
        />

        {/* منطقة الإدخال والمعاينة */}
        <div className="flex-1 min-w-0">
          {/* حقل النص */}
          <textarea
            {...register("content")}
            placeholder="Write a reply..."
            rows={2}
            className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none pt-1"
          ></textarea>

          {/* 🌟 منطقة معاينة الصورة (تصميم ثابت) 🌟 */}
          <div
            className={`relative mt-2  ${convertImg ? "inline-block" : "hidden"}`}
          >
            <img
              src={convertImg}
              alt="Preview mockup"
              className="h-28 md:h-36 w-auto max-w-full rounded-xl object-cover border border-slate-200 shadow-sm"
            />
            {/* زر حذف الصورة (X) */}
            <button
              onClick={() => {
                setValue("image", "");
                setConvertImg(null);
              }}
              className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-500 transition-colors shadow-md cursor-pointer"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* شريط الأدوات السفلي */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            {/* زر رفع الصورة */}
            <div>
              <label className="cursor-pointer flex items-center justify-center p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors">
                <input
                  {...register("image", { onChange: (e) => prepareImg(e) })}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </label>
            </div>

            {/* زر النشر */}
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
