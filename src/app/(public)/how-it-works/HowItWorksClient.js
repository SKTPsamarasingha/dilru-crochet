"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  ClipboardList,
  Scissors,
  ShieldCheck,
  Package,
  Truck,
  Heart,
  Star,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// ─── Real Facebook CDN images from Crochet with Dilru ─────────────────────
const IMG_HERO = "/hero.jpg";
  // "https://scontent.fcmb3-2.fna.fbcdn.net/v/t39.30808-6/732889190_122259144956131406_319818472927283947_n.png?stp=dst-png&cstp=mx851x315&ctp=s851x315&_nc_cat=103&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeF_5QvpG7cAnHF0Hj4MZbCKQT_Pe5PYfddBP897k9h9182aD7A3Q5WxUp5dUmd92nRd63srLTegZF4iGuBRCswH&_nc_ohc=Ykh6Vlqas3MQ7kNvwFoXs20&_nc_oc=AdqB1Ym-6Sh3mb1As6FAZ2R_37aoSJvT5C-1qOPZJGCeg8T6HLVKcKWhWlWF5OmZkz9a6O9D0LoiDbv5H9hKO-HH&_nc_zt=23&_nc_ht=scontent.fcmb3-2.fna&_nc_gid=4adXfWfuu1OmpqJzYYW8ug&_nc_ss=7b2a8&oh=00_AQCJ4fltK1HrGTBOvFHe2h3rBrxXzmPpvvvoEKQAg_13dQ&oe=6A5FB027";
const IMG_CARDIGAN =
  "https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-6/712267326_122256247076131406_7028798248786891449_n.jpg?stp=dst-jpg_tt6&cstp=mx720x960&ctp=s720x960&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHSQyC8jUW5m-OJBEeDcsng29WmPxvEjzHb1aY_G8SPMcmqnq8NbxQzIL9nI1horMEUjQ_3CSI8Y2iEIN6CtInq&_nc_ohc=WKKR-tXhD-oQ7kNvwFiTw_U&_nc_oc=AdrdsfJJTdVgUNRSlRq9nKA5T0T3fwhuTddEb0xawA1bsdyVJrCUjJoM2PvxmW2x6fdXKmJg0sSkia16chqIALdQ&_nc_zt=23&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=pLIg72oc-uGQtJV6ppSscw&_nc_ss=7b2a8&oh=00_AQARJk3CMyTpoJ1Nt6cUxmzupTgIdHXqNGCgBEAwVAzn6w&oe=6A5FAB29";
const IMG_TOTE =
  "https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-6/746171372_122261158652131406_133466072502057137_n.jpg?stp=dst-jpg_tt6&cstp=mx720x960&ctp=s720x960&_nc_cat=109&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGEXVUM-mIRuXNFe-YxwAUDPqHkaPd00qM-oeRo93TSow4XSMuWY0j5Y5TxxZzwOWL7_wCd4fKpMr8kqAIptgBO&_nc_ohc=dSc7pdo24dwQ7kNvwE7Dge_&_nc_oc=Adpog5jjJdaYFVuFCcoSWvUEBXIEiAVBHqFbKSXxvc5PCPxcgsSmEpP2zunPPo10390C-x7HiZBfdnzWukBQvE_j&_nc_zt=23&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=TO5t92IuoCwAAlTwgKyg9g&_nc_ss=7b2a8&oh=00_AQDSbAT1ukzM2BARxyUNYbS5FyAC8BWwEQfbfuhVn8oRvw&oe=6A5FB7FE";

const IMG_FLOWERS =
  "https://scontent.fcmb3-2.fna.fbcdn.net/v/t39.30808-6/737075792_122259637562131406_4979094932434952090_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx720x960&ctp=s720x960&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFvDdGObAS9WdsRn8hRPiMdVyBsyeW8okdXIGzJ5byiR43LRbMdNLTftca6uFXJCpgIoLKxrc6UdfuXci5YF69W&_nc_ohc=Zg6sUT1rGKEQ7kNvwHNT17D&_nc_oc=AdqYzTVSDX8Emt2Zt9QO8SdH6dYBQfwCI3ICqMQZh4EyeZbZfefutuxDhr3podfIT245Gc3en5bTa_HG5k42sm1g&_nc_zt=23&_nc_ht=scontent.fcmb3-2.fna&_nc_gid=Cn-wB4Hz3osYzV9Fz4KQog&_nc_ss=7b2a8&oh=00_AQCPJ203_kgajKurZ47sxw6w9UnY19DjUJDHCWAbXJmomA&oe=6A5FBF0C";
const IMG_BEANIE =
  "https://scontent.fcmb11-3.fna.fbcdn.net/v/t39.30808-6/649970850_122246954552131406_1316847060158297406_n.jpg?stp=c0.169.1536.1536a_dst-jpg_tt6&cstp=mx1536x1536&ctp=s206x206&_nc_cat=109&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeGkW4KkG8mwRA90aFfaSUMTowojHD4dIISjCiMcPh0ghCBNlH0paD4WvdA11bhxxgAYxn18ZAJjuji16W2L3Jx5&_nc_ohc=o0rdHe1t-kIQ7kNvwFy0Mtw&_nc_oc=AdqHJnzo-AEwHKJpFCApd5csx8SM0UhDQ8V2tphJ2_9BhnTKGrvBvxKmFe_beDJJaeRkt61QIBOfLTtram-uLjIY&_nc_zt=23&_nc_ht=scontent.fcmb11-3.fna&_nc_gid=50ZEdY4u4YAD3H-dQFh1UA&_nc_ss=7b2a8&oh=00_AQCm4j67459ZeG7M1yfZc2Y8PDD3HvJ9OK7YfeWxoPBGpg&oe=6A5FD455";
// ─── Process Steps ──────────────────────────────────────────────────────────
const STEPS = [
  {
    number: "01",
    icon: ShoppingBag,
    title: "Choose a Product",
    description:
      "Browse our curated boutique of handmade crochet cardigans, accessories, and gifts. Each listing includes materials, sizing, and custom color options so you can find your perfect match.",
    image: IMG_CARDIGAN,
    accent: "#D8A7B1",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Place Your Order",
    description:
      "Select your size, yarn color, and any personalization preferences. Leave a note with special requests — we love bringing unique visions to life and work closely with you every step of the way.",
    image: IMG_TOTE,
    accent: "#A8C3A0",
  },
  {
    number: "03",
    icon: Scissors,
    title: "Handcrafted with Care",
    description:
      "Your order is crafted stitch by stitch using premium, soft yarn and traditional crochet techniques. Every piece is a labor of love — no shortcuts, no machines, just skilled hands and attention to detail.",
    image: IMG_FLOWERS,
    accent: "#D8A7B1",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Quality Check",
    description:
      "Before packing, each piece is inspected for consistent tension, neat finishing, and overall quality. We want you to receive something you'll treasure for years to come.",
    image: IMG_BEANIE,
    accent: "#A8C3A0",
  },
  {
    number: "05",
    icon: Package,
    title: "Carefully Packaged",
    description:
      "Your handmade piece is wrapped with care using eco-conscious packaging. We believe the unboxing experience should feel as special as the product itself.",
    image: IMG_TOTE,
    accent: "#D8A7B1",
  },
  {
    number: "06",
    icon: Truck,
    title: "Delivered to You",
    description:
      "We'll keep you updated at every step. Your package is dispatched with care and arrives ready to be worn, gifted, or treasured — made with love, just for you.",
    image: IMG_CARDIGAN,
    accent: "#A8C3A0",
  },
];

// ─── Why Handmade ───────────────────────────────────────────────────────────
const WHY_HANDMADE = [
  {
    icon: Heart,
    title: "Made with Intention",
    text: "Every stitch is placed with care, not produced by a machine on a factory line. Your piece carries the energy and focus of a dedicated artisan.",
  },
  {
    icon: Star,
    title: "One-of-a-Kind Quality",
    text: "No two pieces are identical. Small natural variations in texture and tension are part of what makes handmade crochet genuinely special.",
  },
  {
    icon: Sparkles,
    title: "Slow Fashion",
    text: "We believe in making less, but making it beautifully. Handmade crochet lasts longer than mass-produced items and ages with warmth and character.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

export default function HowItWorksClient() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative h-[70vh] min-h-[460px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={IMG_HERO}
            alt="Crochet workspace with finished products"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C2523]/80 via-[#2C2523]/30 to-transparent" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-16 w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-xs uppercase tracking-[0.35em] text-[#D8A7B1] font-semibold mb-3"
          >
            Handmade Process
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl font-bold text-white font-serif leading-tight"
          >
            How It Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 max-w-xl text-sm sm:text-base text-white/80 leading-7"
          >
            From choosing the perfect yarn to your doorstep — every step is
            personal, intentional, and handcrafted.
          </motion.p>
        </div>
      </section>

      {/* ── TIMELINE STEPPER ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-[#D8A7B1] mb-3">
            Your Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2C2523] font-serif">
            From Browse to Doorstep
          </h2>
          <p className="mt-4 text-sm text-[#A0958F] max-w-md mx-auto leading-relaxed">
            Six thoughtful steps that make every Crochet with Dilru order feel
            personal and special.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical center line */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-[#D8A7B1]/20 via-[#A8C3A0]/40 to-[#D8A7B1]/20" />

          <div className="space-y-24">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={step.number}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  custom={0}
                  className={`relative flex flex-col lg:items-center gap-10 lg:gap-0 lg:grid lg:grid-cols-2`}
                >
                  {/* Image side */}
                  <div
                    className={`group ${isEven ? "lg:pr-20" : "lg:pl-20 lg:order-last"}`}
                  >
                    <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-lg border border-[#F5EFEB]">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          background: `linear-gradient(135deg, ${step.accent}60, transparent)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Center step dot */}
                  <div
                    className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full items-center justify-center shadow-lg border-4 border-[#FDFBF7] z-10"
                    style={{ backgroundColor: step.accent }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Text side */}
                  <div
                    className={`space-y-4 ${isEven ? "lg:pl-20" : "lg:pr-20"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: step.accent }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span
                        className="text-5xl  leading-none  font-serif select-none"
                        style={{ color: step.accent }}
                      >
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#2C2523] font-serif">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#6B5B52] leading-7">
                      {step.description}
                    </p>
                    <div
                      className="h-0.5 w-16 rounded-full"
                      style={{ backgroundColor: step.accent }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHY HANDMADE ── */}
      <section className="bg-[#FFF8F2] border-y border-[#F5EFEB] py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-[#A8C3A0] mb-3">
              Why It Matters
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2C2523] font-serif">
              Handmade vs Mass-Produced
            </h2>
            <p className="mt-4 text-sm text-[#A0958F] max-w-lg mx-auto leading-relaxed">
              There's a reason handmade crochet feels different — because it is.
              Every piece tells a story that factory lines simply can't
              replicate.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8">
            {WHY_HANDMADE.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="group bg-white rounded-[2rem] p-8 shadow-sm border border-[#F5EFEB] hover:shadow-md hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF2F5] flex items-center justify-center mb-6 group-hover:bg-[#D8A7B1]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[#D8A7B1]" />
                  </div>
                  <h3 className="font-bold text-[#2C2523] font-serif text-lg mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#6B5B52] leading-6">
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── GALLERY STRIP ── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-[#D8A7B1] mb-3">
            The Collection
          </span>
          <h2 className="text-3xl font-bold text-[#2C2523] font-serif">
            Finished with Love
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[IMG_CARDIGAN, IMG_TOTE, IMG_FLOWERS, IMG_BEANIE].map((src, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.1}
              className="group aspect-square rounded-[1.5rem] overflow-hidden border border-[#F5EFEB] shadow-sm"
            >
              <img
                src={src}
                alt={`Crochet creation ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-24 px-4">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto rounded-[2.5rem] overflow-hidden relative"
        >
          <div className="absolute inset-0">
            <img
              src={IMG_BEANIE}
              alt="Start your handmade journey"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#2C2523]/70 backdrop-blur-sm" />
          </div>
          <div className="relative z-10 text-center py-20 px-8">
            <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-[#D8A7B1] mb-3">
              Ready to Begin?
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif mb-5">
              Start Your Handmade Journey
            </h2>
            <p className="text-white/75 text-sm leading-7 max-w-lg mx-auto mb-10">
              Browse our boutique collection and place a custom order tailored
              exactly to your style, size, and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D8A7B1] hover:bg-[#C8909B] text-[#2C2523] font-bold px-8 py-4 text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                Shop Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/community"
                className="inline-flex items-center justify-center rounded-2xl border border-white/40 text-white hover:bg-white/10 font-bold px-8 py-4 text-sm transition-all"
              >
                Visit Community
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
