import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Return Policy | Crochet with Dilru",
  description: "Details about our made-to-order return and exchange policy.",
};

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-[2rem] border border-[#F5EFEB] bg-white p-8 shadow-sm sm:p-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2c2523] transition-colors hover:text-[#e0a996]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#F5EFEB] p-3 text-[#e0a996]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#96A288]">
              Handmade boutique policy
            </p>
            <h1 className="text-3xl font-bold font-serif text-[#2c2523] sm:text-4xl">
              Return Policy
            </h1>
          </div>
        </div>

        <div className="space-y-5 rounded-[1.5rem] border border-[#F5EFEB] bg-[#FDFBF7] p-6 text-sm leading-relaxed text-[#4A3728]">
          <p>
            Each piece at Crochet with Dilru is thoughtfully handcrafted and
            made-to-order, so every item is created especially for you.
          </p>
          <p>
            Returns are accepted only when an item arrives damaged, incorrect,
            or not as described. Please report any issue within 48 hours of
            delivery so we can review it promptly.
          </p>
          <p>
            Personalized or custom-made items are generally final sale unless a
            production mistake has occurred on our side.
          </p>
          <p>
            If you believe your order qualifies for a return or replacement,
            please contact us with your order details and photos of the item so
            we can assist you.
          </p>
        </div>
      </div>
    </main>
  );
}
