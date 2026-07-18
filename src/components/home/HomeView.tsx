"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import Footer from "@/components/layout/Footer";
import { StarsIcon } from "@/components/Icons";

const STEPS = [
  {
    step: "01",
    icon: "calendar_month",
    title: "Share Your Birth Date",
    description: "We use your date of birth to calculate your core numerology numbers.",
  },
  {
    step: "02",
    icon: "calculate",
    title: "We Decode Your Numbers",
    description: "Your birth & destiny numbers are cross-referenced against vehicle energies.",
  },
  {
    step: "03",
    icon: "directions_car",
    title: "Get Your Alignment",
    description: "Receive lucky colors, plate numbers & buying dates made for you.",
  },
];

const DISCOVERIES = [
  { icon: "palette", label: "Lucky Colors" },
  { icon: "pin", label: "Ideal Reg. Numbers" },
  { icon: "event", label: "Best Buying Dates" },
  { icon: "shield", label: "Hidden Conflicts" },
];

const TRUST = [
  { icon: "auto_awesome", label: "Instant Report" },
  { icon: "encrypted", label: "Secure & Private" },
  { icon: "verified_user", label: "10K+ Users" },
];

const MotionLink = motion.create(Link);

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function HomeView({
  isLoggedIn,
  primaryHref,
}: {
  isLoggedIn: boolean;
  primaryHref: string;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0A0A0A] text-on-surface antialiased">
      {/* Background Visuals */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="accent-glow top-10 -right-24"
          animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="accent-glow bottom-10 -left-24"
          animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.span
          className="floating-number absolute top-24 right-6 text-[180px] leading-none"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          7
        </motion.span>
        <motion.span
          className="floating-number absolute bottom-32 left-4 text-[140px] leading-none"
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          3
        </motion.span>
        <motion.span
          className="floating-number absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[220px] leading-none"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          9
        </motion.span>
      </div>

      {/* Top bar */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex w-full items-center justify-center px-container-margin py-5"
      >
        <div className="flex items-center gap-2">
          <StarsIcon />
          <span className="font-headline-alt text-body-lg font-bold leading-6 tracking-[-0.4px] text-primary normal-case">
            NUMO AI
          </span>
        </div>
      </motion.header>

      <main className="relative z-10 mx-auto max-w-md px-container-margin pb-16">
        {/* Hero */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={stagger}
          className="pt-12 pb-10 text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="mx-auto font-headline text-[28px] font-bold tracking-[-0.02em] text-on-background"
          >
            Your Vehicle&apos;s <br /> <span className="text-primary">Cosmic Blueprint</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-xs text-body-lg leading-6 text-on-surface-variant"
          >
            Numerology-powered insights that align your birth profile with the perfect vehicle — colors, numbers &amp; dates included.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center gap-3">
            <MotionLink
              href={primaryHref}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="inner-glow w-full max-w-xs rounded-xl bg-primary-container py-3.5 text-center font-bold text-on-primary-container shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              {isLoggedIn ? "Continue Your Journey" : "Start Free Analysis"}
            </MotionLink>
            {!isLoggedIn && (
              <Link
                href="/login"
                className="text-[13px] font-semibold text-on-surface-variant transition-colors hover:text-primary"
              >
                Already have an account? <span className="text-primary">Log in</span>
              </Link>
            )}
          </motion.div>
        </motion.section>

        {/* How it works */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="mb-stack-gap-lg"
        >
          <motion.h2
            variants={fadeUp}
            className="mb-4 px-1 font-headline text-headline-sm font-semibold text-on-surface-variant"
          >
            How It Works
          </motion.h2>
          <div className="flex flex-col gap-3">
            {STEPS.map((s) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="glass-card flex items-center gap-4 rounded-xl p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="material-symbols-outlined text-primary">{s.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="mb-0.5 flex items-center gap-2">
                    <span className="font-numeral text-[11px] tracking-widest text-primary/70">{s.step}</span>
                    <h3 className="font-headline text-[15px] font-semibold text-on-background">{s.title}</h3>
                  </div>
                  <p className="text-[13px] leading-5 text-on-surface-variant">{s.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* What you'll discover */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="mb-stack-gap-lg"
        >
          <motion.h2
            variants={fadeUp}
            className="mb-4 px-1 font-headline text-headline-sm font-semibold text-on-surface-variant"
          >
            What You&apos;ll Discover
          </motion.h2>
          <div className="grid grid-cols-2 gap-3">
            {DISCOVERIES.map((d) => (
              <motion.div
                key={d.label}
                variants={fadeUp}
                whileHover={{ scale: 1.04, y: -2 }}
                className="glass-card flex flex-col items-center gap-2 rounded-xl p-4 text-center"
              >
                <span className="material-symbols-outlined text-primary">{d.icon}</span>
                <span className="text-[13px] font-medium leading-tight text-on-surface">{d.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Trust badges */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="mb-stack-gap-lg grid grid-cols-3 gap-stack-gap-sm"
        >
          {TRUST.map((t) => (
            <motion.div key={t.label} variants={fadeUp} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>
                  {t.icon}
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase leading-tight tracking-wider text-on-surface-variant">
                {t.label}
              </p>
            </motion.div>
          ))}
        </motion.section>

        {/* Final CTA */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="flex items-center gap-4 rounded-xl border border-white/10 bg-primary/5 p-4 backdrop-blur-[20px]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20">
            <span className="material-symbols-outlined text-primary">flare</span>
          </div>
          <div className="flex-1">
            <span className="text-label-caps font-bold uppercase tracking-wider text-primary">
              Ready When You Are
            </span>
            <p className="text-body-sm leading-5 text-on-surface">
              Your cosmic vehicle match is a few taps away.
            </p>
          </div>
          <MotionLink
            href={primaryHref}
            aria-label="Get started"
            whileHover={{ scale: 1.1, x: 3 }}
            whileTap={{ scale: 0.9 }}
            className="material-symbols-outlined shrink-0 rounded-full bg-primary/10 p-2 text-primary"
          >
            arrow_forward
          </MotionLink>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
