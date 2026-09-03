import { schema } from "@hookform/resolvers/ajv/src/__tests__/__fixtures__/data.js";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import schemaRes from "./schema";
export default function Register() {
  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
    mode: "all",
    resolver: zodResolver(schemaRes),
  });

  async function handelDataUser(data) {
    // console.log(data);
    toast.promise(
      axios.post("https://route-posts.routemisr.com/users/signup", data),
      {
        loading: "please wait",
        success: function (res) {
          return <p> {res.data?.message} </p>;
        },
        error: function (err) {
          console.log(err.response?.data);

          return <p>{err.response?.data.message}</p>;
        },
      },
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-950 text-white font-sans">
      {/* Left Column: Branding Banner */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-linear-to-br from-purple-300 via-purple-700 to-purple-950 relative overflow-hidden">
        {/* Header / Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <span className="text-3xl font-bold tracking-tight text-white font-playwrite ">
            <span className="text-purple-800">W</span>anas
          </span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight text-white ">
            Build your social world{" "}
            <span className="text-purple-200">now.</span>
          </h1>
          <p className="text-purple-100 text-xl leading-relaxed opacity-90">
            Join <span className="font-semibold text-white">Wanas</span> and
            start connecting with friends, sharing ideas, and creating content
            in a unique digital space.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-purple-200">
          © 2026 Wanas Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="flex items-center justify-center p-8 sm:p-12 md:p-20 bg-gray-950">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-extrabold tracking-tight text-white">
              Create an Account
            </h2>
            <p className="mt-3 text-lg text-gray-400">
              Enter your details to register, or{" "}
              <Link
                to="/login"
                className="font-semibold text-purple-400 hover:text-purple-300 transition"
              >
                Sign in to your existing account
              </Link>
            </p>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-900/40"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-950 px-3 text-purple-300/60 font-medium">
                Register with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handelDataUser)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1.5">
                Full Name
              </label>
              <input
                {...register("name")}
                type="text"
                name="name"
                placeholder="Ahmed Bahnasy"
                className="w-full px-5 py-3 rounded-xl bg-gray-900 border border-purple-900/40 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-inner"
              />
            </div>
            {formState.errors?.name && formState.touchedFields.name && (
              <div
                className="flex items-center gap-2 p-3.5 mt-2 text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-xl animate-fade-in"
                role="alert"
              >
                <svg
                  className="w-4 h-4 shrink-0 text-red-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                </svg>

                <div>
                  <span className="font-semibold text-red-300">Error: </span>
                  {formState.errors?.name.message}
                </div>
              </div>
            )}
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1.5">
                Username
              </label>

              <input
                {...register("username")}
                type="text"
                name="username"
                placeholder="Bahnasy202222"
                className="w-full px-5 py-3 rounded-xl bg-gray-900 border border-purple-900/40 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-inner"
              />
            </div>
            {formState.errors?.username && formState.touchedFields.username && (
              <div
                className="flex items-center gap-2 p-3.5 mt-2 text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-xl animate-fade-in"
                role="alert"
              >
                <svg
                  className="w-4 h-4 shrink-0 text-red-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                </svg>

                <div>
                  <span className="font-semibold text-red-300">Error: </span>
                  {formState.errors?.username?.message}
                </div>
              </div>
            )}
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1.5">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                name="email"
                placeholder="bahnasyd20222@gmail.com"
                className="w-full px-5 py-3 rounded-xl bg-gray-900 border border-purple-900/40 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-inner"
              />
            </div>
            {formState.errors?.email && formState.touchedFields.email && (
              <div
                className="flex items-center gap-2 p-3.5 mt-2 text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-xl animate-fade-in"
                role="alert"
              >
                <svg
                  className="w-4 h-4 shrink-0 text-red-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                </svg>

                <div>
                  <span className="font-semibold text-red-300">Error: </span>
                  {formState.errors?.email.message}
                </div>
              </div>
            )}
            {/* Date of Birth & Gender Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1.5">
                  Date of Birth
                </label>
                <input
                  {...register("dateOfBirth")}
                  type="date"
                  name="dateOfBirth"
                  className="w-full px-5 py-3 rounded-xl bg-gray-900 border border-purple-900/40 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-inner color-scheme-dark"
                />
                {formState.errors?.dateOfBirth &&
                  formState.touchedFields.dateOfBirth && (
                    <div
                      className="flex items-center gap-2 p-3.5 mt-2 text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-xl animate-fade-in"
                      role="alert"
                    >
                      <svg
                        className="w-4 h-4 shrink-0 text-red-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                      </svg>

                      <div>
                        <span className="font-semibold text-red-300">
                          Error:{" "}
                        </span>
                        {formState.errors.dateOfBirth.message}
                      </div>
                    </div>
                  )}
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1.5">
                  Gender
                </label>
                <select
                  {...register("gender")}
                  name="gender"
                  defaultValue=""
                  className="w-full px-5 py-3 rounded-xl bg-gray-900 border border-purple-900/40 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-inner cursor-pointer"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male" className="bg-gray-900 text-white">
                    Male
                  </option>
                  <option value="female" className="bg-gray-900 text-white">
                    Female
                  </option>
                </select>
                {formState.errors?.gender && formState.touchedFields.gender && (
                  <div
                    className="flex items-center gap-2 p-3.5 mt-2 text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-xl animate-fade-in"
                    role="alert"
                  >
                    <svg
                      className="w-4 h-4 shrink-0 text-red-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                    </svg>

                    <div>
                      <span className="font-semibold text-red-300">
                        Error:{" "}
                      </span>
                      {formState.errors.gender.message}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1.5">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full px-5 py-3 rounded-xl bg-gray-900 border border-purple-900/40 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-inner"
              />
            </div>
            {formState.errors?.password && formState.touchedFields.password && (
              <div
                className="flex items-center gap-2 p-3.5 mt-2 text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-xl animate-fade-in"
                role="alert"
              >
                <svg
                  className="w-4 h-4 shrink-0 text-red-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                </svg>

                <div>
                  <span className="font-semibold text-red-300">Error: </span>
                  {formState.errors.password.message}
                </div>
              </div>
            )}
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1.5">
                Confirm Password
              </label>
              <input
                {...register("rePassword")}
                type="password"
                name="rePassword"
                placeholder="••••••••"
                className="w-full px-5 py-3 rounded-xl bg-gray-900 border border-purple-900/40 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-inner"
              />
            </div>
            {formState.errors?.rePassword &&
              formState.touchedFields.rePassword && (
                <div
                  className="flex items-center gap-2 p-3.5 mt-2 text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-xl animate-fade-in"
                  role="alert"
                >
                  <svg
                    className="w-4 h-4 shrink-0 text-red-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                  </svg>

                  <div>
                    <span className="font-semibold text-red-300">Error: </span>
                    {formState.errors.rePassword?.message}
                  </div>
                </div>
              )}
            <button
              type="submit"
              className="w-full py-4 px-5 bg-linear-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-400 hover:to-purple-600 text-white font-bold rounded-xl transition duration-200 shadow-xl shadow-purple-900/40 transform hover:-translate-y-0.5 mt-4"
            >
              Create Account for Free
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
