import Link from "next/link";

export const metadata = {
  title: "How It Works | Crochet with Dilru",
  description:
    "Learn how Crochet with Dilru brings your custom crochet ideas to life with handcrafted process, customization, and care.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-10">
        <section className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#A0958F]">
            Handmade Process
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-[#2C2523] font-serif">
            How It Works
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-sm sm:text-base text-[#4A3728] leading-7">
            From selecting the perfect yarn to delivering a lovingly finished crochet piece, we make every order simple, personal, and beautifully handcrafted.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <article className="rounded-3xl border border-[#F5EFEB] bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-[#2C2523] font-serif">1. Explore the Collection</h2>
            <p className="mt-3 text-sm text-[#4A3728] leading-6">
              Browse our curated boutique of crochet cardigans, accessories, and gifts. Each item includes materials, sizing, and custom options so you can choose the perfect match.
            </p>
          </article>
          <article className="rounded-3xl border border-[#F5EFEB] bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-[#2C2523] font-serif">2. Personalize Your Order</h2>
            <p className="mt-3 text-sm text-[#4A3728] leading-6">
              Select your preferred size, yarn color, and any special requests. We welcome custom details and work closely with you to turn your vision into a one-of-a-kind piece.
            </p>
          </article>
          <article className="rounded-3xl border border-[#F5EFEB] bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-[#2C2523] font-serif">3. Crafted with Care</h2>
            <p className="mt-3 text-sm text-[#4A3728] leading-6">
              Every order is handcrafted using premium yarn and traditional crochet techniques. We focus on thoughtful stitching, neat finishes, and a gentle, luxe feel.
            </p>
          </article>
          <article className="rounded-3xl border border-[#F5EFEB] bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-[#2C2523] font-serif">4. Delivered to Your Door</h2>
            <p className="mt-3 text-sm text-[#4A3728] leading-6">
              After final quality checks, your item is wrapped with care and sent on its way. We keep you updated at every step so your handmade order arrives beautifully.
            </p>
          </article>
        </section>

        <section className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-3xl bg-[#FFF7ED] p-6 text-center">
            <p className="text-sm font-semibold text-[#E18C7E] uppercase tracking-[0.2em]">Comfort</p>
            <p className="mt-3 text-sm text-[#4A3728] leading-6">
              Soft, wearable pieces designed to feel cozy day after day.
            </p>
          </div>
          <div className="rounded-3xl bg-[#EEF4E8] p-6 text-center">
            <p className="text-sm font-semibold text-[#7A9A75] uppercase tracking-[0.2em]">Quality</p>
            <p className="mt-3 text-sm text-[#4A3728] leading-6">
              Carefully selected yarn and attention to detail in every stitch.
            </p>
          </div>
          <div className="rounded-3xl bg-[#F5E8F1] p-6 text-center">
            <p className="text-sm font-semibold text-[#B66F9F] uppercase tracking-[0.2em]">Care</p>
            <p className="mt-3 text-sm text-[#4A3728] leading-6">
              Personalized support from order placement through delivery.
            </p>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 items-center rounded-3xl border border-[#F5EFEB] bg-white p-10">
          <div>
            <h2 className="text-2xl font-semibold text-[#2C2523] font-serif">Ready to start your custom crochet order?</h2>
            <p className="mt-3 text-sm text-[#4A3728] leading-6">
              Browse our signature styles, or connect with us through community chat for a custom creation tailored to your style.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-2xl bg-[#E0A996] px-6 py-3 text-sm font-semibold text-[#2C2523] hover:bg-[#CF9581] transition-colors"
            >
              Shop Collection
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center justify-center rounded-2xl border border-[#E0A996] px-6 py-3 text-sm font-semibold text-[#4A3728] hover:bg-[#F5EFEB] transition-colors"
            >
              Visit Community
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
