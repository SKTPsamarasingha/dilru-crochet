"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6 py-20">
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-[#F5EFEB] bg-white/80 px-8 py-8 shadow-sm backdrop-blur">
        <Loader2 className="h-7 w-7 animate-spin text-[#E0A996]" />
        <p className="text-sm font-semibold text-[#4A3728]">Loading page…</p>
      </div>
    </div>
  );
}
