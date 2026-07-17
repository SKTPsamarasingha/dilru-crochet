"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";

// ─── Real Facebook CDN images ────────────────────────────────────────────────

const IMG_D =
  "https://scontent.fcmb3-3.fna.fbcdn.net/v/t39.30808-6/749300919_122261156648131406_9118623590054553301_n.jpg?stp=dst-jpg_tt6&cstp=mx720x960&ctp=s720x960&_nc_cat=109&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGOrC9NrD3bdh2cdvAcDWXvkB7-5txX-_6QHv7m3Ff7_jaHVnPK2TbfjmI4of7Zh9gsVowOwd8fYvN_DFAOd9o_&_nc_ohc=TxJibUzjxTwQ7kNvwEOl3Ct&_nc_oc=Adp9xU6lrtSWof8qOvUyXQ-5Jq9TN94gpuC3oKSLEevJkscDasgn8Ywxzm8Vosb1USQbZo8PvvTIKh-uStFEGzZT&_nc_zt=23&_nc_ht=scontent.fcmb3-3.fna&_nc_gid=iRZpJF-_d-oDr8M49wovGw&_nc_ss=7b2a8&oh=00_AQCTiYLfR7EFaeEWXNhwkIvK9aED8WmEnf0F5xkZj4xFIA&oe=6A5FA11B";
const IMG_COMMUNITY =
  "https://scontent.fcmb11-3.fna.fbcdn.net/v/t39.30808-6/739243585_122259929936131406_8064892688350052236_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x2048&ctp=s1536x2048&_nc_cat=111&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEyDAyVmfa0dqAr0vxp_4QHmLF25ncUc7GYsXbmdxRzsTfiVjV6uKfY_72-i_RgvVDGxody767gDTsHXfoo_Vcl&_nc_ohc=3JHPOcWKo8cQ7kNvwGQEFUf&_nc_oc=AdpcuZLlaGmKXoLWHi41JfFv5A2fm5DhrK-c8exb_gwmBJpDyL9a3d5QBm5xmOXsUoTlBDctXp14_8uK2SNAXuhI&_nc_zt=23&_nc_ht=scontent.fcmb11-3.fna&oh=00_AQC4fC85pF7gyYowJwJXfPr44BVsIMB9TyiwZPaKZ_Ej3w&oe=6A5BA722";

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


// ─── Timeline milestones ─────────────────────────────────────────────────────
const MILESTONES = [
  {
    year: "2023",
    label: "Where It Started",
    story:
      "Crochet with Dilru began in a small living room with a single hook, a bundle of soft yarn, and a passion for slow craft. The first pieces were made as personal gifts for family and close friends — each one poured with intention and love.",
    image: IMG_CARDIGAN,
    imageAlt: "First handmade crochet cardigan",
  },
  {
    year: "2024",
    label: "First Orders",
    story:
      "Word spread naturally. Friends of friends began asking to order, and what started as a personal passion quietly became a small business. The first commercial orders were cardigans and handmade accessories made to exact custom specifications.",
    image: IMG_BEANIE,
    imageAlt: "Early crochet accessories and beanies",
  },
  // {
  //   year: "2024",
  //   label: "Growing the Community",
  //   story:
  //     "As the Facebook page grew, so did the community around it. Customers became regulars, sharing photos of their pieces, suggesting new colors, and inspiring the next collection. Dilru listened, iterated, and made each new design better than the last.",
  //   image: IMG_COMMUNITY,
  //   imageAlt: "Community members sharing crochet creations",
  // },
  {
    year: "2025",
    label: "Expanding the Collection",
    story:
      "With growing demand came a wider range — crochet flowers, tote bags, home decor, and seasonal gifts joined the boutique lineup. Every piece still handcrafted one at a time, every stitch still placed with the same care as the very first order.",
    image: IMG_FLOWERS,
    imageAlt: "Expanded crochet flower and accessory collection",
  },
  {
    year: "Today",
    label: "Handcrafted with Purpose",
    story:
      "Crochet with Dilru is now a thriving boutique crochet brand rooted in slow fashion, personal service, and genuine craft. The mission has never changed: to make things that feel beautiful, thoughtful, and entirely one-of-a-kind.",
    image: IMG_HERO,
    imageAlt: "Today's beautiful Crochet with Dilru products",
  },
];

const SPLIT_SECTIONS = [
  {
    label: "A Handmade Passion",
    heading: "Every stitch placed\nwith intention",
    body: "We started as a small crochet studio offering custom orders for loved ones and special moments. Each item is made by hand — one stitch at a time — guided by the belief that handmade means thoughtful, beautiful, and enduring. When you wear something from Crochet with Dilru, you wear something crafted just for you.",
    image: IMG_CARDIGAN,
    imageLeft: false,
    accent: "#D8A7B1",
  },
  {
    label: "Thoughtful Design",
    heading: "Soft yarns, timeless\ncolors, elegant pieces",
    body: "From cozy cardigans to delicate accessories and vibrant crochet flowers, every design is chosen to celebrate the person wearing or gifting it. We hand-select soft yarns and curate color palettes that feel effortless and luxurious — pieces that improve with age and use.",
    image: IMG_FLOWERS,
    imageLeft: true,
    accent: "#A8C3A0",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.08, ease: "easeOut" },
  }),
};

export default function OurStoryClient() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative h-[80vh] min-h-[520px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={IMG_HERO}
            alt="Crochet with Dilru handmade tote bag"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1210]/85 via-[#2C2523]/30 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute top-8 right-8 hidden md:flex flex-col items-end gap-1 text-right"
        >
          <span className="text-white/60 text-xs tracking-[0.25em] uppercase font-semibold">
            Handmade in Sri Lanka
          </span>
          <div className="w-12 h-px bg-white/30 ml-auto" />
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20 w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-xs uppercase tracking-[0.35em] text-[#D8A7B1] font-semibold mb-4"
          >
            Crafted with Heart
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-bold text-white font-serif leading-none tracking-tight"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="mt-6 max-w-lg text-sm sm:text-base text-white/75 leading-7"
          >
            Crochet with Dilru began with a love for slow craft, thoughtful
            gifting, and making every stitch feel like a warm hug.
          </motion.p>
        </div>
      </section>

      {/* ── QUOTE BANNER ── */}
      <section className="bg-[#D8A7B1]/10 border-y border-[#D8A7B1]/20 py-16 px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <Quote className="w-10 h-10 text-[#D8A7B1] mx-auto mb-6 opacity-60" />
          <blockquote className="text-2xl sm:text-3xl font-serif font-bold text-[#2C2523] leading-snug">
            "Every piece we make carries a little piece of us — the care, the
            patience, and the joy of crafting something beautiful by hand."
          </blockquote>
          <p className="mt-6 text-sm font-semibold text-[#A0958F] tracking-wide">
            — Dilru, Founder of Crochet with Dilru
          </p>
        </motion.div>
      </section>

      {/* ── STORY SPLIT SECTIONS ── */}
      {SPLIT_SECTIONS.map((section, i) => (
        <section
          key={section.label}
          className={`py-24 ${i % 2 === 0 ? "bg-[#FDFBF7]" : "bg-[#FFF8F2]"}`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div
              className={`flex flex-col lg:flex-row items-center gap-16 ${
                section.imageLeft ? "lg:flex-row-reverse" : ""
              }`}
            >
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full lg:w-1/2 group"
              >
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl border border-[#F5EFEB] aspect-[3/4] max-h-[600px]">
                  <img
                    src={section.image}
                    alt={section.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1/3"
                    style={{ background: `linear-gradient(to top, ${section.accent}50, transparent)` }}
                  />
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.15}
                className="w-full lg:w-1/2 space-y-6"
              >
                <span
                  className="text-[10px] uppercase tracking-[0.3em] font-bold"
                  style={{ color: section.accent }}
                >
                  {section.label}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#2C2523] font-serif leading-snug whitespace-pre-line">
                  {section.heading}
                </h2>
                <div className="w-12 h-0.5 rounded-full" style={{ backgroundColor: section.accent }} />
                <p className="text-[#6B5B52] text-sm leading-8">{section.body}</p>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* ── DARK TIMELINE ── */}
      <section className="py-24 bg-[#2C2523]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-[#D8A7B1] mb-3">
              The Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif">
              Milestones & Memories
            </h2>
            <p className="mt-4 text-sm text-white/50 max-w-md mx-auto leading-relaxed">
              From a single yarn ball to a growing handmade brand — each chapter
              of the story woven with purpose.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#D8A7B1]/20 via-[#D8A7B1]/50 to-[#D8A7B1]/20 hidden sm:block" />
            <div className="space-y-14">
              {MILESTONES.map((milestone, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={i * 0.06}
                  className="flex gap-8 sm:gap-12 items-start"
                >
                  <div className="hidden sm:flex flex-col items-center flex-shrink-0 relative">
                    <div className="w-4 h-4 rounded-full bg-[#D8A7B1] border-4 border-[#2C2523] ring-2 ring-[#D8A7B1]/40 mt-1 relative z-10" />
                    <span className="mt-3 text-[10px] uppercase tracking-[0.2em] font-bold text-[#D8A7B1] whitespace-nowrap">
                      {milestone.year}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row gap-6 bg-white/5 border border-white/10 rounded-[1.5rem] p-6 hover:bg-white/8 transition-colors">
                    <div className="w-full sm:w-28 flex-shrink-0 rounded-2xl overflow-hidden aspect-square sm:aspect-auto sm:h-28">
                      <img
                        src={milestone.image}
                        alt={milestone.imageAlt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="block sm:hidden text-[10px] uppercase tracking-[0.2em] font-bold text-[#D8A7B1]">
                        {milestone.year}
                      </span>
                      <h3 className="text-lg font-bold text-white font-serif">
                        {milestone.label}
                      </h3>
                      <p className="text-sm text-white/60 leading-7">{milestone.story}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BEHIND THE SCENES GALLERY ── */}
      <section className="py-24 bg-[#FFF8F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-14"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#A8C3A0] mb-3 block">
              Behind the Scenes
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2C2523] font-serif max-w-lg leading-snug">
              A Peek Into the Studio
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { src: IMG_CARDIGAN, span: "row-span-2" },
              { src: IMG_FLOWERS, span: "" },
              { src: IMG_BEANIE, span: "" },
              { src: IMG_D, span: "" },
              // { src: IMG_COMMUNITY, span: "row-span-2" },
              { src: IMG_FLOWERS, span: "" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.07}
                className={`group rounded-[1.5rem] overflow-hidden border border-[#F5EFEB] shadow-sm ${item.span}`}
              >
                <div className={`relative ${item.span ? "h-full min-h-[200px]" : "aspect-square"}`}>
                  <img
                    src={item.src}
                    alt={`Studio shot ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-[#2C2523]/0 group-hover:bg-[#2C2523]/15 transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION + VALUES ── */}
      <section className="py-24 px-4">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid sm:grid-cols-2 gap-8 items-stretch">
            <div className="bg-[#D8A7B1]/10 border border-[#D8A7B1]/20 rounded-[2rem] p-10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D8A7B1] mb-4 block">
                  Our Mission
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#2C2523] font-serif leading-snug mb-6">
                  To make things that feel beautiful, thoughtful, and entirely
                  one-of-a-kind.
                </h2>
                <p className="text-sm text-[#6B5B52] leading-7">
                  When you choose Crochet with Dilru, you get a handmade piece
                  crafted with quality materials, designed for the person wearing
                  it, and delivered with warmth and genuine care.
                </p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D8A7B1] hover:bg-[#C8909B] text-[#2C2523] font-bold px-7 py-3.5 text-sm transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  Shop Collection <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center rounded-2xl border border-[#D8A7B1]/50 text-[#2C2523] hover:bg-[#D8A7B1]/10 font-bold px-7 py-3.5 text-sm transition-all"
                >
                  How It Works
                </Link>
              </div>
            </div>

            <div className="bg-white border border-[#F5EFEB] rounded-[2rem] p-10 shadow-sm space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#A8C3A0] block">
                What We Believe
              </span>
              {[
                {
                  title: "Slow is better.",
                  body: "We don't rush. Each piece takes the time it needs to be made right.",
                },
                {
                  title: "Handmade lasts.",
                  body: "Quality craftsmanship stands the test of time. We make things meant to be kept.",
                },
                {
                  title: "Community matters.",
                  body: "Our customers inspire our designs. Every piece reflects their voices.",
                },
              ].map((v) => (
                <div key={v.title} className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-[#A8C3A0] mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-[#2C2523] text-sm mb-1">{v.title}</p>
                    <p className="text-xs text-[#6B5B52] leading-5">{v.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
