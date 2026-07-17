"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Users,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const FacebookIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

// ─── Real Facebook CDN images ────────────────────────────────────────────────
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
const FB_URL = "https://web.facebook.com/p/Crochet-with-dilru-61553942184584/";

// ─── Gallery data ────────────────────────────────────────────────────────────
const GALLERY = [
  {
    src: IMG_CARDIGAN,
    alt: "Handmade crochet cardigan",
    tall: true,
    label: "Handmade Cardigan",
  },
  {
    src: IMG_FLOWERS,
    alt: "Beautiful crochet flowers",
    tall: false,
    label: "Crochet Flowers",
  },
  {
    src: IMG_BEANIE,
    alt: "Cosy crochet beanie",
    tall: false,
    label: "Crochet Beanie",
  },
  { src: IMG_TOTE, alt: "Crochet tote bag", tall: false, label: "Tote Bag" },
  {
    src: IMG_HERO,
    alt: "Crochet community post",
    tall: true,
    label: "Community Feature",
  },
  {
    src: IMG_CARDIGAN,
    alt: "Crochet cardigan styling",
    tall: false,
    label: "Cardigan Styling",
  },
  {
    src: IMG_FLOWERS,
    alt: "Floral crochet gift",
    tall: false,
    label: "Gift Flowers",
  },
  {
    src: IMG_BEANIE,
    alt: "Crochet accessories",
    tall: true,
    label: "Accessories",
  },
];

const TESTIMONIALS = [
  {
    name: "Amara S.",
    rating: 5,
    text: "I ordered a custom cardigan and it arrived even more beautiful than I imagined. The quality is incredible and Dilru was so thoughtful throughout the whole process!",
    product: "Custom Crochet Cardigan",
  },
  {
    name: "Nimesha K.",
    rating: 5,
    text: "The crochet flowers were the most unique birthday gift I've ever given. My friend was absolutely speechless. Will definitely be ordering again for every special occasion.",
    product: "Crochet Flower Bouquet",
  },
  {
    name: "Tharushi P.",
    rating: 5,
    text: "Fast, careful packaging and the piece itself is stunning. You can tell every stitch was placed with real care. Worth every penny — this is slow fashion at its best.",
    product: "Crochet Accessories",
  },
];

const HIGHLIGHTS = [
  { icon: Users, number: "500+", label: "Happy Customers" },
  { icon: Heart, number: "1,200+", label: "Facebook Followers" },
  { icon: Star, number: "100%", label: "Handmade Pieces" },
  { icon: Share2, number: "50+", label: "Customer Photos Shared" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function CommunityClient() {
  const [lightboxImg, setLightboxImg] = useState(null);

  return (
    <div className="min-h-screen bg-[#FDFBF7] overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative h-[75vh] min-h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={IMG_HERO}
            alt="Crochet with Dilru community"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C2523]/85 via-[#2C2523]/50 to-[#2C2523]/20" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-[#A8C3A0] font-bold mb-4">
              Join the Conversation
            </p>
            <h1 className="text-5xl sm:text-7xl font-bold text-white font-serif leading-none tracking-tight mb-6">
              Our
              <br />
              Community
            </h1>
            <p className="text-white/75 text-sm sm:text-base leading-7 mb-10">
              Thousands of crochet lovers, thoughtful gifters, and handmade
              enthusiasts. We're growing and we'd love to have you with us.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={FB_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-[#1877F2] hover:bg-[#1467D2] text-white font-bold px-6 py-3.5 text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <FacebookIcon className="w-4 h-4" />
                Follow on Facebook
              </a>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/40 text-white hover:bg-white/15 font-bold px-6 py-3.5 text-sm transition-all"
              >
                Shop Handmade <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SOCIAL PROOF STATS ── */}
      <section className="bg-[#2C2523] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {HIGHLIGHTS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#D8A7B1]/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-[#D8A7B1]" />
                  </div>
                  <p className="text-3xl font-bold text-white font-serif">
                    {stat.number}
                  </p>
                  <p className="text-xs text-white/50 mt-1 font-semibold tracking-wide uppercase">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MASONRY GALLERY ── */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D8A7B1] mb-3 block">
              Customer Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2C2523] font-serif leading-snug">
              Made for You.
              <br />
              Shared with Love.
            </h2>
          </div>
          <p className="text-sm text-[#A0958F] max-w-xs leading-6">
            Tag us on Facebook with{" "}
            <span className="font-bold text-[#D8A7B1]">@crochetwith_dilru</span>{" "}
            to get featured in our gallery.
          </p>
        </motion.div>

        {/* Pinterest-style masonry */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {GALLERY.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.06}
              className="group relative break-inside-avoid rounded-[1.5rem] overflow-hidden border border-[#F5EFEB] shadow-sm cursor-pointer mb-4"
              onClick={() => setLightboxImg(item)}
            >
              <div
                className={`relative ${item.tall ? "aspect-[2/3]" : "aspect-square"}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#2C2523]/0 group-hover:bg-[#2C2523]/45 transition-all duration-400 flex items-end justify-start p-4">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs font-bold leading-tight">
                      {item.label}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Heart className="w-3.5 h-3.5 text-[#D8A7B1]" />
                      <MessageCircle className="w-3.5 h-3.5 text-white/70" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
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
              Customer Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2C2523] font-serif">
              What Our Community Says
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="group bg-white border border-[#F5EFEB] rounded-[2rem] p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500"
              >
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 text-[#D8A7B1] fill-[#D8A7B1]"
                    />
                  ))}
                </div>
                <p className="text-sm text-[#6B5B52] leading-7 mb-6">
                  "{t.text}"
                </p>
                <div className="border-t border-[#F5EFEB] pt-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#D8A7B1]/20 flex items-center justify-center text-[#D8A7B1] font-bold text-sm flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2C2523]">{t.name}</p>
                    <p className="text-[10px] text-[#A0958F] font-medium">
                      {t.product}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED CREATIONS STRIP ── */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-[#D8A7B1] mb-3">
            Featured Creations
          </span>
          <h2 className="text-3xl font-bold text-[#2C2523] font-serif">
            Fresh from the Studio
          </h2>
          <p className="mt-4 text-sm text-[#A0958F] max-w-sm mx-auto leading-relaxed">
            Our latest handcrafted pieces, straight from the Crochet with Dilru
            Facebook page.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {[IMG_CARDIGAN, IMG_TOTE, IMG_FLOWERS, IMG_BEANIE].map((src, i) => (
            <motion.a
              key={i}
              href={FB_URL}
              target="_blank"
              rel="noreferrer"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.08}
              className="group block relative aspect-square rounded-[1.5rem] overflow-hidden border border-[#F5EFEB] shadow-sm"
            >
              <img
                src={src}
                alt={`Featured creation ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#2C2523]/0 group-hover:bg-[#2C2523]/50 transition-all duration-400 flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── HOW TO CONNECT (dark) ── */}
      <section className="bg-[#2C2523] py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-[#A8C3A0] mb-3">
              Stay Connected
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif">
              Three Ways to Be Part
              <br />
              of Our Community
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: FacebookIcon,
                title: "Follow on Facebook",
                body: "Stay updated on new arrivals, behind-the-scenes content, seasonal drops, and community highlights. The most active way to connect with us.",
                link: FB_URL,
                linkLabel: "Visit Page →",
                color: "#1877F2",
                bg: "rgba(24,119,242,0.08)",
              },
              {
                icon: MessageCircle,
                title: "Chat with Us",
                body: "Have a custom order idea? Need sizing advice? Drop us a message on Facebook. We respond warmly and quickly to every inquiry.",
                link: FB_URL,
                linkLabel: "Message Dilru →",
                color: "#D8A7B1",
                bg: "rgba(216,167,177,0.08)",
              },
              {
                icon: Share2,
                title: "Share Your Piece",
                body: "Received your order? We'd love to see it! Tag us in your photo on Facebook and get featured in our community gallery.",
                link: FB_URL,
                linkLabel: "Get Featured →",
                color: "#A8C3A0",
                bg: "rgba(168,195,160,0.08)",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="rounded-[2rem] p-8 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 duration-400"
                  style={{ background: item.bg }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: `${item.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <h3 className="font-bold text-white font-serif text-lg mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/55 leading-7 mb-6">
                    {item.body}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold transition-opacity hover:opacity-75"
                    style={{ color: item.color }}
                  >
                    {item.linkLabel}
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 bg-[#FDFBF7]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-[#D8A7B1] mb-4">
            Ready to Join?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2C2523] font-serif mb-5 leading-snug">
            Be Part of the Crochet
            <br />
            with Dilru Family
          </h2>
          <p className="text-sm text-[#6B5B52] leading-7 max-w-lg mx-auto mb-10">
            Follow us on Facebook for new arrivals, community posts, and
            handmade inspiration. Or head to our shop and start your
            personalized crochet journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={FB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#1877F2] hover:bg-[#1467D2] text-white font-bold px-8 py-4 text-sm transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <FacebookIcon className="w-4 h-4" />
              Follow Crochet with Dilru
            </a>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D8A7B1] hover:bg-[#C8909B] text-[#2C2523] font-bold px-8 py-4 text-sm transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              Shop Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImg(null)}
              className="fixed inset-0 bg-[#1A1210]/90 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative z-10 max-w-xl w-full"
            >
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2C2523] shadow-lg hover:bg-red-50 hover:text-red-500 transition-colors z-20 cursor-pointer"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={lightboxImg.src}
                  alt={lightboxImg.alt}
                  className="w-full max-h-[80vh] object-contain bg-[#1A1210]"
                />
              </div>
              <p className="text-center text-white/60 text-xs mt-4 font-semibold">
                {lightboxImg.label}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
