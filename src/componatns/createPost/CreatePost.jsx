import React, { useRef, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export default function CreateComment() {
  const { userData, token } = useContext(AuthContext);
  const [img, setImg] = useState(null);
  const body = useRef(null);
  const image = useRef(null);
  const query = useQueryClient();
  function dataCreate() {
    let formData = new FormData();
    if (body.current.value) {
      formData.append("body", body.current.value);
    }
    if (image.current.files[0]) {
      formData.append("image", image.current.files[0]);
    }
    return formData;
  }

  function handleImg(e) {
    const imgUpload = URL.createObjectURL(e.target.files[0]);
    setImg(imgUpload);
  }
  function createPost() {
    return axios.post(`https://route-posts.routemisr.com/posts`, dataCreate(), {
      headers: {
        token: token,
      },
    });
  }
  const { mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: (res) => {
      toast.success(res.data.message);
      query.invalidateQueries({ queryKey: ["AllPosts"] });
      body.current.value = null;
      image.current.value = null;
      setImg(null);
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });

  return (
    <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto bg-white rounded-3xl p-4 md:p-5 shadow-2xl border border-slate-100 my-4">
      <div className="flex items-start gap-3 md:gap-4">
        {/* صورة المستخدم */}
        <img
          src={userData?.photo}
          alt="User"
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-slate-50 object-cover shrink-0 mt-0.5"
        />

        {/* حاوية الإدخال (الفقاعة) */}
        <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white focus-within:border-slate-200 focus-within:shadow-sm border border-transparent rounded-2xl p-3 transition-all duration-300">
          {/* 🖼️ معاينة الصورة المرفوعة (Image Preview Area) */}
          <div className="relative mb-2 inline-block">
            <img
              src={img}
              alt="Uploaded Preview"
              className={`w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl border border-slate-200/80 shadow-xs ${img ? "" : "hidden"}`}
            />
            {/* زر إزالة الصورة (X) */}
            <button
              onClick={() => {
                setImg(null);
                if (image.current) image.current.value = "";
              }}
              type="button"
              className={`${img ? "" : "hidden"} absolute -top-2 -right-2 bg-slate-800/80 hover:bg-red-500 text-white rounded-full p-1 shadow-md transition-colors cursor-pointer`}
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

          {/* حقل النص */}
          <textarea
            ref={body}
            rows="1"
            placeholder="Write a post..."
            className="w-full bg-transparent text-slate-700 text-sm md:text-base outline-none py-1 resize-none wrap-break-word whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-32"
          ></textarea>

          {/* شريط الأدوات السفلي */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 mt-1">
            {/* زر رفع صورة جديد */}
            <label className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-slate-500 hover:text-indigo-600 cursor-pointer p-1.5 hover:bg-indigo-50/60 rounded-lg transition-colors">
              <svg
                className="w-5 h-5 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <span>Photo</span>
              <input
                onChange={handleImg}
                ref={image}
                type="file"
                className="hidden"
              />
            </label>

            {/* زر الإرسال */}
            <button
              onClick={() => mutate()}
              type="submit"
              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors cursor-pointer"
            >
              <svg
                className="w-5 h-5 transform -rotate-45 mb-0.5 ml-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
