import Link from "next/link";

export const metadata = {
  title: "Community | Crochet with Dilru",
  description:
    "Join the Crochet with Dilru community to share custom ideas, ask questions, and connect over handmade crochet creations.",
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-10">
        <section className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#A0958F]">
            Join the conversation
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-[#2C2523] font-serif">
            Community
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-sm sm:text-base text-[#4A3728] leading-7">
            Connect with fellow crochet lovers, share your favorite styles, and get support for custom orders and handmade gift ideas.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-3xl border border-[#F5EFEB] bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-[#2C2523] font-serif">Share Your Ideas</h2>
            <p className="mt-3 text-sm text-[#4A3728] leading-6">
              Tell us what you’d like to see next, from color combinations to custom-fit crochet styles.
            </p>
          </div>
          <div className="rounded-3xl border border-[#F5EFEB] bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-[#2C2523] font-serif">Ask Questions</h2>
            <p className="mt-3 text-sm text-[#4A3728] leading-6">
              Need help choosing yarn, sizing, or gifting options? We’re here to offer guidance and thoughtful suggestions.
            </p>
          </div>
          <div className="rounded-3xl border border-[#F5EFEB] bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-[#2C2523] font-serif">Stay Inspired</h2>
            <p className="mt-3 text-sm text-[#4A3728] leading-6">
              Discover styling ideas, seasonal looks, and handmade gift inspiration from our boutique community.
            </p>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          <article className="rounded-3xl bg-[#FFF7ED] p-8 text-[#4A3728] shadow-sm">
            <h3 className="text-xl font-semibold text-[#2C2523] font-serif">Chat with us</h3>
            <p className="mt-3 text-sm leading-6">
              Reach out on Facebook for custom order help, product questions, or design suggestions.
            </p>
          </article>
          <article className="rounded-3xl bg-[#EEF4E8] p-8 text-[#4A3728] shadow-sm">
            <h3 className="text-xl font-semibold text-[#2C2523] font-serif">Stay connected</h3>
            <p className="mt-3 text-sm leading-6">
              Follow along for new arrivals, handmade updates, and community stories from Crochet with Dilru.
            </p>
          </article>
          <article className="rounded-3xl bg-[#F5E8F1] p-8 text-[#4A3728] shadow-sm">
            <h3 className="text-xl font-semibold text-[#2C2523] font-serif">Gift ideas</h3>
            <p className="mt-3 text-sm leading-6">
              Browse our selection of unique, meaningful handmade gift pieces perfect for celebrations and special moments.
            </p>
          </article>
        </section>

        <section className="rounded-3xl border border-[#F5EFEB] bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-[#2C2523] font-serif">Ready to connect?</h2>
          <p className="mt-4 text-sm text-[#4A3728] leading-7">
            Visit our shop, send a chat message, or simply explore the ways we can create something handmade just for you.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-2xl bg-[#E0A996] px-6 py-3 text-sm font-semibold text-[#2C2523] hover:bg-[#CF9581] transition-colors"
            >
              Shop Now
            </Link>
            <a
              href="https://web.facebook.com/p/Crochet-with-dilru-61553942184584/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border border-[#E0A996] px-6 py-3 text-sm font-semibold text-[#4A3728] hover:bg-[#F5EFEB] transition-colors"
            >
              Message Us
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
