import { Search } from "lucide-react";

export default function AdminSearchFilterBar({
  searchValue,
  onSearchChange,
  placeholder,
  summary,
  children,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#FBEFEA] bg-white p-3 shadow-xxs sm:p-4 md:flex-row md:items-center md:justify-between md:gap-4">
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center md:flex-1">
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-[#EBE5E0] bg-[#FDFBF7] py-2 pl-9 pr-4 text-[11px] text-[#2C2523] placeholder-[#A0958F] transition-all focus:border-[#E0A996] focus:outline-none sm:text-xs"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A0958F]" />
        </div>

        {summary ? (
          <p className="text-[10px] font-medium text-[#A0958F] sm:text-[11px]">
            {summary}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap justify-start gap-2 md:justify-end">
        {children}
      </div>
    </div>
  );
}
