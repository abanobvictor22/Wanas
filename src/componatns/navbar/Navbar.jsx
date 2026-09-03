import React, { useState } from "react";
import { useContext } from "react";
import { data, Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Post");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);
  const { userData } = useContext(AuthContext);
  const navLinks = [
    {
      name: "Post",
      path: "/",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      ),
    },
    {
      name: "Profile",
      path: "/userProfile",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      ),
    },
  ];

  function logOut() {
    setToken(null);
    localStorage.removeItem("tokenUser");
    navigate("/login");
  }

  return (
    <>
      {/* النافبار الرئيسي (Glassmorphism) */}
      <nav className=" fixed top-0 w-full bg-white/70 backdrop-blur-lg shadow-2xl z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* الجزء الأيسر: اللوجو */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="hidden sm:block">
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
                  <span className="text-xl font-bold tracking-tight text-black font-playwrite ">
                    <span className="text-purple-800">W</span>anas
                  </span>
                </h1>
              </div>
            </Link>

            {/* الجزء الأوسط: الروابط (سطح المكتب) */}
            <ul className="flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = activeTab === link.name;
                return (
                  <li key={link.name}>
                    <NavLink
                      to={link.path}
                      // onClick={() => setActiveTab(link.name)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-purple-100 text-purple-700 shadow-sm"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        }`
                      }
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        {link.icon}
                      </svg>
                      {link.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {/* الجزء الأيمن: البروفايل */}
            {!userData && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white animate-pulse">
                {/* دائرية الصورة */}
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                {/* شريط الاسم */}
                <div className="h-4 w-24 bg-gray-300 rounded-md"></div>
                {/* دائرية السهم */}
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
              </div>
            )}
            {userData && (
              <div className="flex  items-center gap-4">
                {/* زر القائمة للموبايل */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        isMobileMenuOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16M4 18h16"
                      }
                    />
                  </svg>
                </button>

                <div className="hidden lg:block relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <img
                      src={userData?.photo}
                      alt="Profile"
                      className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200"
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      {userData?.name}
                    </span>
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* القائمة المنسدلة */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden text-sm z-50">
                      <div className="px-4 py-4 bg-slate-50/50 border-b border-slate-100">
                        <p className="font-bold text-slate-800">
                          {userData?.name}
                        </p>
                      </div>

                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors font-medium"
                        >
                          Profile Settings
                        </Link>
                      </div>

                      <div className="p-2 border-t border-slate-100">
                        <button
                          onClick={logOut}
                          className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold flex items-center gap-2 cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* قائمة الموبايل */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 lg:hidden bg-white/90 backdrop-blur-lg border-b border-slate-200 shadow-xl z-40">
          <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* قسم المستخدم في الموبايل */}
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Abanoub"
                  className="w-10 h-10 rounded-full border border-slate-200"
                  alt="Avatar"
                />
                <div>
                  <p className="font-bold text-slate-800">Abanoub</p>
                  <p className="text-xs text-slate-500">Frontend Developer</p>
                </div>
              </div>
              <button
                onClick={logOut}
                className="text-sm font-semibold text-red-500 hover:text-red-600 cursor-pointer bg-red-50 px-3 py-1.5 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
