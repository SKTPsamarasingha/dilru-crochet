import Link from "next/link";

export const metadata = {
  title: "Our Story | Crochet with Dilru",
  description:
    "Discover the story behind Crochet with Dilru, our passion for handmade crochet, and the creative heart behind every piece.",
};

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-12">
        <section className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#A0958F]">
            Crafted with heart
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-[#2C2523] font-serif">
            Our Story
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-sm sm:text-base text-[#4A3728] leading-7">
            Crochet with Dilru began with a love for slow craft, thoughtful gifting, and making every stitch feel like a warm hug.
          </p>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#F5EFEB] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#2C2523] font-serif">A handmade passion</h2>
            <p className="mt-4 text-sm text-[#4A3728] leading-7">
              We started as a small crochet studio offering custom orders for loved ones and special moments. Each item is made by hand, one stitch at a time, guided by a belief that handmade means thoughtful, beautiful, and enduring.
            </p>
          </div>
          <div className="rounded-3xl border border-[#F5EFEB] bg-[#FFF7ED] p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#2C2523] font-serif">Thoughtful design</h2>
            <p className="mt-4 text-sm text-[#4A3728] leading-7">
              From cozy cardigans to delicate accessories, we choose soft yarns and timeless color palettes that feel effortless and luxurious. Every design is made to celebrate the person wearing it.
            </p>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-4">
            <div className="rounded-3xl bg-[#F5E8F1] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#B66F9F]">Inspired by community</p>
              <p className="mt-3 text-sm text-[#4A3728] leading-6">
                Our designs grow with the people who wear them — your feedback, requests, and stories shape what we create.
              </p>
            </div>
            <div className="rounded-3xl bg-[#EEF4E8] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#7A9A75]">Slow-made care</p>
              <p className="mt-3 text-sm text-[#4A3728] leading-6">
                We keep our process small and intentional, so every order receives careful attention from first sketch to final package.
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-[#F5EFEB] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#2C2523] font-serif">Our promise</h2>
            <p className="mt-4 text-sm text-[#4A3728] leading-7">
              When you choose Crochet with Dilru, you get a handmade piece designed to feel special, crafted with quality materials, and delivered with warmth and thoughtful service.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-[#F5EFEB] bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-[#2C2523] font-serif">Let’s make something beautiful together</h2>
          <p className="mt-4 text-sm text-[#4A3728] leading-7">
            Whether you’re shopping for a custom cardigan, gift, or cozy accessory, we’re here to help your ideas come to life with thoughtful crochet craftsmanship.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[#E0A996] px-8 py-3 text-sm font-semibold text-[#2C2523] hover:bg-[#CF9581] transition-colors"
          >
            Start Shopping
          </Link>
        </section>
      </main>
    </div>
  );
}
