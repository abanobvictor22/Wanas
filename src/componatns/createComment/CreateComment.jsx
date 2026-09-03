import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function CreateComment({ id }) {
  const { userData, token } = useContext(AuthContext);
  const [img, setImg] = useState(null);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      content: "",
      image: "",
    },
  });
  const query = useQueryClient();
  function prepareData(d) {
    let formData = new FormData();
    if (d.content) {
      formData.append("content", d.content);
    }
    if (d.image[0]) {
      formData.append("image", d.image[0]);
    }

    console.log(formData.get("content"));
    console.log(formData.get("image"));
    mutate(formData);
  }
  function handleImg(e) {
    const imgUpload = URL.createObjectURL(e.target.files[0]);
    setImg(imgUpload);
  }
  function setComment(formData) {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${id}/comments`,
      formData,
      {
        headers: {
          token: token,
        },
      },
    );
  }

  const { mutate } = useMutation({
    mutationFn: setComment,
    onSuccess: (res) => {
      toast.success(res.data.message);
      if (id) {
        query.invalidateQueries({ queryKey: ["allComment"] });
        query.invalidateQueries({ queryKey: ["post", id] });
      }
      query.invalidateQueries({ queryKey: ["AllPosts"] });

      reset();
      setImg(null);
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="flex items-start gap-3 md:gap-4 bg-slate-50/80 hover:bg-slate-50 focus-within:bg-white focus-within:border-purple-200 focus-within:shadow-sm border border-slate-200/70 rounded-2xl p-3 md:p-4 transition-all duration-300">
        {/* صورة المستخدم */}
        <img
          src={userData?.photo}
          alt="User"
          className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-100 object-cover border border-purple-100 shrink-0 mt-0.5"
        />

        {/* حاوية الكتابة والأدوات */}
        <div className="flex-1 flex flex-col gap-2">
          {/* حقل الإدخال */}
          <form onSubmit={handleSubmit(prepareData)}>
            <textarea
              {...register("content")}
              rows="2"
              placeholder="Write a comment..."
              className="w-full bg-transparent text-slate-700 text-sm md:text-base outline-none resize-none placeholder-slate-400 leading-relaxed"
            ></textarea>

            {/* معاينة الصورة (تظهر فقط عند إرفاق صورة) */}
            <div
              className={`relative self-start mt-1 ${img ? "inline-block" : "hidden"}`}
            >
              <img
                src={img}
                alt="Preview"
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl border border-slate-200 shadow-xs"
              />
              <button
                onClick={() => setImg(null)}
                type="button"
                className="absolute -top-2 -right-2 bg-slate-800/80 hover:bg-red-500 text-white rounded-full p-1 shadow-md transition-colors cursor-pointer"
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

            {/* شريط الأزرار السفلي */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-1">
              {/* زر رفع صورة */}
              <label className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-500 hover:text-purple-600 cursor-pointer p-1.5 hover:bg-purple-50 rounded-lg transition-colors">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <span>Photo</span>
                <input
                  {...register("image", {
                    onChange: (e) => handleImg(e),
                  })}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </label>

              {/* زر إرسال الكومنت */}
              <button
                type="submit"
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs md:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Comment</span>
                <svg
                  className="w-3.5 h-3.5 transform -rotate-45"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
