"use client";

import { useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * Site-wide ambient background: a warm orange glow and a spotlighted grid that follow the cursor.
 * On touch devices (no hover) the glow drifts slowly on its own.
 */
export function InteractiveBackground() {
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const glowX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.6 });
  const glowY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.6 });
  const trailX = useSpring(mouseX, { stiffness: 25, damping: 18, mass: 1.2 });
  const trailY = useSpring(mouseY, { stiffness: 25, damping: 18, mass: 1.2 });

  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${glowX}px ${glowY}px, black 0%, transparent 70%)`;

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // Start centred in the upper part of the viewport so the page never loads "cold".
    mouseX.set(window.innerWidth * 0.65);
    mouseY.set(window.innerHeight * 0.3);

    if (reduce) return;

    if (canHover) {
      const onMove = (event: PointerEvent) => {
        mouseX.set(event.clientX);
        mouseY.set(event.clientY);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    }

    let frame = 0;
    const start = performance.now();
    const drift = (time: number) => {
      const t = (time - start) / 1000;
      mouseX.set(window.innerWidth * (0.5 + Math.sin(t * 0.25) * 0.3));
      mouseY.set(window.innerHeight * (0.35 + Math.cos(t * 0.18) * 0.2));
      frame = requestAnimationFrame(drift);
    };
    frame = requestAnimationFrame(drift);
    return () => cancelAnimationFrame(frame);
  }, [mouseX, mouseY, reduce]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      {/* Static warm wash anchoring the top of the page */}
      <div className="absolute -top-1/3 left-1/2 h-[70vh] w-[120vw] -translate-x-1/2 rounded-full bg-brand/[0.07] blur-[120px]" />

      {/* Grid, revealed only around the cursor */}
      <motion.div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(228,229,231,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(228,229,231,0.07) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: spotlight,
          WebkitMaskImage: spotlight,
        }}
      />

      {/* Lagging trail */}
      <motion.div
        className="absolute size-[640px] rounded-full bg-brand-700/20 blur-[140px]"
        style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
      />

      {/* Main glow */}
      <motion.div
        className="absolute size-[380px] rounded-full bg-brand/25 blur-[100px]"
        style={{ x: glowX, y: glowY, translateX: "-50%", translateY: "-50%" }}
      />

      <div className="grain absolute inset-0 opacity-[0.035] mix-blend-overlay" />
    </div>
  );
}
