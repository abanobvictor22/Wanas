import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import schemaLogin from "./schemaLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../../componatns/context/AuthContext";

export default function Login() {
  const { setToken, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schemaLogin),
  });

  async function handelLogin(data) {
    toast.promise(
      axios.post("https://route-posts.routemisr.com/users/signin", data),
      {
        loading: "please wait",
        success: (res) => {
          setToken(res.data.data.token);

          localStorage.setItem("tokenUser", res.data.data.token);
          navigate("/");

          return <p>login success</p>;
        },
        error: (err) => {
          console.log(err.response?.data);
          return <p>login failed</p>;
        },
      },
    );
  }
  return (
    <>
      <div className=" min-h-screen bg-linear-to-br from-purple-300 via-purple-700 to-purple-950 flex items-center justify-center p-4 ">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              Welcome Back 👋
            </h1>
            <p className="text-slate-400 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handelLogin)} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 text-white text-sm rounded-xl outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            {formState.errors.email && formState.touchedFields.email && (
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
                  {formState.errors.email?.message}
                </div>
              </div>
            )}
            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <a
                  href="#forgot-password"
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 text-white text-sm rounded-xl outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            {formState.errors.password && formState.touchedFields.password && (
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
                  {formState.errors.password?.message}
                </div>
              </div>
            )}
            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-900 cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-xs text-slate-400 select-none cursor-pointer"
              >
                Remember me on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-600/20 transition-all duration-200 cursor-pointer"
            >
              Sign In
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-xs text-slate-400 mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
