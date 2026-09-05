import axios from "axios";
import React, { useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "../../componatns/context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export default function UserProfile() {
  const { token } = useContext(AuthContext);
  const query = useQueryClient();
  function getUserData() {
    return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: {
        token: token,
      },
    });
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(),
  });
  const userData = data?.data?.data?.user;

  const { register } = useForm({
    defaultValues: {
      cover: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: (formdata) => {
      return axios.put(
        `https://route-posts.routemisr.com/users/upload-cover`,
        formdata,
        {
          headers: {
            token: token,
          },
        },
      );
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["userData"] });
    },
    onError: (err) => console.log(err.response),
  });
  const { mutate: deleteCover } = useMutation({
    mutationFn: () => {
      return axios.delete(
        `https://route-posts.routemisr.com/users/upload-cover`,
        {
          headers: {
            token: token,
          },
        },
      );
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["userData"] });
    },
  });
  return (
    <div
      className="min-h-screen mt-10 bg-slate-100 text-slate-800 p-4 sm:p-6 lg:p-8"
      dir="ltr"
    >
      <div className="w-full max-w-350 mx-auto space-y-6">
        {/* Cover Photo */}
        <div className="w-full h-56 sm:h-72 rounded-3xl relative shadow-lg overflow-hidden group bg-slate-200 hover:z-20 hover:h-screen duration-2500 hover:opacity-95">
          <img
            src={
              userData?.cover ||
              `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe`
            }
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/10"></div>

          {/* Change Cover Button (Visible on Hover) */}
          <div className="absolute left-5 top-5 flex items-center justify-center  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <label className="px-5 py-2.5 bg-white/90 hover:bg-white text-slate-800 font-semibold text-sm rounded-2xl shadow-lg cursor-pointer transition-all transform hover:scale-105 flex items-center gap-2">
              <span>📷 Change Cover Photo</span>

              <input
                onChange={(e) => {
                  let formData = new FormData();
                  if (e.target.files[0]) {
                    formData.append("cover", e.target.files[0]);
                    mutate(formData);
                  }
                  console.log(formData.get("cover"));
                }}
                type="file"
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
          <div className="absolute right-5 top-5 flex items-center justify-center  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => {
                deleteCover();
              }}
            >
              <svg
                className="w-4 h-4 stroke-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span> Remove Cover Photo</span>
            </button>
          </div>
        </div>

        {/* Main Profile Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 -mt-20 sm:-mt-24 relative mx-4 sm:mx-8 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6 text-center lg:text-left">
            {/* Profile Picture */}
            <div className="relative p-1.5 rounded-full bg-purple-600 shadow-2xl group/avatar">
              <div className="bg-white rounded-full p-1 overflow-hidden">
                <img
                  src="https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                  alt="abanob victor"
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover block"
                />
              </div>

              {/* Change Avatar Overlay (Visible on Hover) */}
              <label className="absolute inset-1.5 rounded-full bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer text-white shadow-inner">
                <svg
                  className="w-8 h-8 mb-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-xs font-bold tracking-wide">
                  Change Photo
                </span>
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 capitalize">
                  Abanob Victor
                </h1>
                <span className="px-3 py-0.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-100 shadow-sm">
                  @abanob
                </span>
              </div>
              <p className="text-sm font-semibold text-purple-600 capitalize">
                Male
              </p>
              <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
                Frontend Web Developer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none px-7 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-2xl transition-all shadow-md shadow-purple-600/20 cursor-pointer">
              Edit Profile
            </button>
            <button className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-2xl transition-all cursor-pointer">
              Share Account
            </button>
          </div>
        </div>

        {/* Wide Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-0 sm:px-8">
          {/* Left Sidebar: Account Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                About & Info
              </h3>
              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-purple-50 text-purple-600 rounded-xl text-base">
                    ✉️
                  </span>
                  <span
                    className="font-medium truncate"
                    title="abanobvictor2000@gmail.com"
                  >
                    abanobvictor2000@gmail.com
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-purple-50 text-purple-600 rounded-xl text-base">
                    🎂
                  </span>
                  <span className="font-medium">Born Dec 10, 1995</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-purple-50 text-purple-600 rounded-xl text-base">
                    📅
                  </span>
                  <span className="font-medium">Joined August 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content: Stats & Posts */}
          <div className="lg:col-span-3 space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Followers
                </span>
                <span className="text-4xl font-black text-slate-900 mt-3">
                  2
                </span>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Following
                </span>
                <span className="text-4xl font-black text-purple-600 mt-3">
                  1
                </span>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Bookmarks
                </span>
                <span className="text-4xl font-black text-slate-900 mt-3">
                  0
                </span>
              </div>
            </div>

            {/* User Uploaded Posts Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
                <span>User Posts</span>
                <span className="text-xs text-purple-600 bg-purple-50 px-3 py-1 rounded-full cursor-pointer hover:bg-purple-100 transition-colors">
                  View All
                </span>
              </h3>

              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <p className="text-slate-500 text-sm font-medium">
                  No posts available yet.
                </p>
                <button className="mt-4 px-5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
                  Create First Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
