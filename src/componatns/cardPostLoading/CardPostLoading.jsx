import React from "react";

export default function CardPostLoading() {
  return (
    <div className="shadow-2xl max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto bg-white rounded-3xl p-5 md:p-7 lg:p-8 border border-slate-100 my-6 md:my-8 relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-slate-100/80 to-transparent animate-[shimmer_1.5s_infinite] pointer-events-none" />

      {/* Header: Avatar + Name & Date */}
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Avatar */}
          <div className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-slate-200 shrink-0 animate-pulse" />

          {/* Name & Date */}
          <div className="space-y-2">
            <div className="h-3.5 bg-slate-200 rounded-md w-28 md:w-36 animate-pulse" />
            <div className="h-2.5 bg-slate-200 rounded-md w-20 md:w-24 animate-pulse" />
          </div>
        </div>

        {/* Options Icon */}
        <div className="w-6 h-6 bg-slate-200 rounded-full animate-pulse" />
      </div>

      {/* Post Text */}
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-slate-200 rounded-md w-3/4 animate-pulse" />
        <div className="h-3 bg-slate-200 rounded-md w-1/2 animate-pulse" />
      </div>

      {/* Stats (Likes / Comments / Shares) */}
      <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-3 bg-slate-200 rounded-md w-12 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 bg-slate-200 rounded-md w-16 animate-pulse" />
          <div className="h-3 bg-slate-200 rounded-md w-14 animate-pulse" />
        </div>
      </div>

      {/* Action Buttons (Like, Comment, Share) */}
      <div className="flex items-center justify-between pt-3 gap-2">
        <div className="h-9 bg-slate-100 rounded-xl flex-1 animate-pulse" />
        <div className="h-9 bg-slate-100 rounded-xl flex-1 animate-pulse" />
        <div className="h-9 bg-slate-100 rounded-xl flex-1 animate-pulse" />
      </div>
    </div>
  );
}
