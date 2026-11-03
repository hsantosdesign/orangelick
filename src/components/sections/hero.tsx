"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Heart, Leaf, Star } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SocialIcon } from "@/components/ui/social-icon";
import { LogoMark } from "@/components/layout/logo";

const words = ["Sushki", "Pryaniki", "Sukhariki", "Medovik", "Kozinaki", "Zefir", "Baranki", "Vatrushka"];

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Pointer parallax for the illustration
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 80, damping: 18 });
  const sy = useSpring(py, { stiffness: 80, damping: 18 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const nearX = useTransform(sx, [-0.5, 0.5], [-30, 30]);
  const nearY = useTransform(sy, [-0.5, 0.5], [-30, 30]);
  const farX = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const farY = useTransform(sy, [-0.5, 0.5], [18, -18]);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const instagram = siteConfig.social.find((s) => s.platform === "instagram") ?? siteConfig.social[0];

  return (
    <section ref={sectionRef} className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-16 pt-32 sm:pt-36">
      <div className="container-page grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div style={{ y: contentY, opacity: contentOpacity }}>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-mist"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-brand" />
            </span>
            Fresh batches, made in the USA
          </motion.span>

          <h1 className="mt-8 text-[2.6rem] font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
            {["Snacks that", "taste like", "home."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  className={cn("block", i === 2 && "text-gradient")}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-mist-400 sm:text-xl"
          >
            Old-school Russian recipes, rebooted for the way you snack now. Crunchy, cozy and honest, the kind of comfort that
            fits in your backpack.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/products" className={cn(buttonVariants({ size: "lg" }), "group")}>
              Explore the snacks
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            {instagram ? (
              <a href={instagram.href} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                <SocialIcon platform={instagram.platform} />
                Follow {instagram.handle}
              </a>
            ) : null}
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-sm"
          >
            {[
              { icon: Heart, label: "Family recipes" },
              { icon: Leaf, label: "No artificial colors" },
              { icon: Star, label: "Small-batch baked" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-mist">
                <dt className="sr-only">Promise</dt>
                <Icon className="size-4 text-brand" aria-hidden />
                <dd>{label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease }}
          onPointerMove={onPointerMove}
          onPointerLeave={() => {
            px.set(0);
            py.set(0);
          }}
          className="relative mx-auto aspect-square w-full max-w-[520px] [perspective:1200px]"
          aria-hidden
        >
          <motion.div style={{ rotateX, rotateY }} className="relative size-full [transform-style:preserve-3d]">
            <motion.div style={{ x: farX, y: farY }} className="absolute inset-[8%] rounded-full border border-white/10" />
            <motion.div style={{ x: farX, y: farY }} className="absolute inset-[20%] rounded-full border border-dashed border-brand/30" />

            <div className="absolute inset-[18%] rounded-full bg-gradient-to-br from-brand-300 via-brand to-brand-700 shadow-[0_40px_120px_-20px_rgba(241,113,3,0.7)]">
              <div className="grain absolute inset-0 rounded-full opacity-20 mix-blend-overlay" />
              <div className="absolute inset-0 flex items-center justify-center">
                <LogoMark className="size-1/2 drop-shadow-2xl [&_circle]:fill-ink" />
              </div>
            </div>

            <motion.div
              style={{ x: nearX, y: nearY }}
              className="glass absolute left-0 top-[12%] animate-float rounded-2xl px-4 py-3 shadow-xl"
            >
              <p className="text-xs text-mist-500">Today&apos;s crunch</p>
              <p className="font-display text-sm font-bold text-white">Honey Sushki</p>
            </motion.div>

            <motion.div
              style={{ x: nearX, y: nearY }}
              className="glass absolute bottom-[14%] right-0 animate-float rounded-2xl px-4 py-3 shadow-xl [animation-delay:-3s]"
            >
              <div className="flex items-center gap-1 text-brand">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-1 font-display text-sm font-bold text-white">Grandma-approved</p>
            </motion.div>

            <motion.div
              style={{ x: farX, y: nearY }}
              className="absolute bottom-[6%] left-[16%] flex size-20 animate-float items-center justify-center rounded-full bg-mist font-display text-xs font-bold uppercase leading-tight text-ink shadow-xl [animation-delay:-1.5s]"
            >
              <span className="rotate-[-12deg] text-center">
                Since
                <br />
                Babushka
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative mt-20 border-y border-white/10 bg-white/[0.02] py-5" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...words, ...words].map((word, i) => (
            <span key={`${word}-${i}`} className="flex items-center gap-10 font-display text-2xl font-bold text-white/80 sm:text-3xl">
              {word}
              <span className="size-2 rounded-full bg-brand" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
