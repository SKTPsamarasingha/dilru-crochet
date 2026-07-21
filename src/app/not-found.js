import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
      <div className="rounded-3xl border border-[#F5EFEB] bg-white/80 px-8 py-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#E0A996]">
          404
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-[#2C2523]">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-[#6F625C]">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-[#E0A996] px-4 py-2 text-sm font-semibold text-[#2C2523] transition hover:bg-[#CF9581]"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
