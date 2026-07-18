"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import TrustBadge from "./TrustBadge";
import Footer from "@/components/layout/Footer";
import { GoogleIcon } from "@/components/Icons";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setLoading(true);
    try {
      router.push(`/login/otp?mobile=${phone}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/vehicle-numerology" });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };


  return (
    <div className="text-on-background min-h-screen flex flex-col bg-[#0a0a0a]">
      <main
        style={{
          backgroundImage: "linear-gradient(rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.7)), url('/pngs/login-bg.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="flex-grow flex flex-col items-center justify-start pt-12 pb-24 px-container-margin relative overflow-hidden">

        {/* Branding */}
        <motion.header
          initial="hidden"
          animate="show"
          variants={stagger}
          className="w-full flex flex-col items-center text-center mb-stack-gap-lg z-10"
        >
          <motion.img
            variants={fadeUp}
            alt="NUMO AI Logo"
            className="w-48 mb-stack-gap-md drop-shadow-2xl"
            src="/svgs/login.svg"
          />
          <motion.h1
            variants={fadeUp}
            className="font-headline-alt text-2xl font-bold text-primary tracking-[-0.4px] normal-case mb-2"
          >
            NUMO AI
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm text-on-surface-variant opacity-80 px-4">
            Premium Numerology &amp; Vehicle Insights
          </motion.p>
        </motion.header>

        {/* Login card */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={stagger}
          className="w-full max-w-md glass-card rounded-3xl p-element-padding flex flex-col gap-stack-gap-md z-20 relative"
        >

          <form onSubmit={handleContinue} className="flex flex-col gap-stack-gap-md">
            <motion.div variants={fadeUp} className="flex flex-col gap-stack-gap-sm">
              <label
                htmlFor="phone"
                className="text-[12px] font-bold tracking-[0.05em] uppercase text-on-surface-variant pl-1"
              >
                Mobile Number
              </label>
              <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl border border-white/10 px-4 py-3 focus-within:border-primary transition-colors">
                <span className="text-on-surface-variant font-bold text-base">+91</span>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <input
                  id="phone"
                  className="bg-transparent border-none outline-none w-full text-on-surface placeholder:text-outline/40 p-0 text-base"
                  placeholder="Enter Mobile Number"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => { setError(""); setPhone(e.target.value.replace(/\D/g, "")); }}
                />
              </div>
            </motion.div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <motion.div variants={fadeUp} className="flex items-center justify-center">
              <input
                type="checkbox"
                id="accept-terms"
                className="accent-primary w-4 h-4 mr-2"
                required
              />
              <label htmlFor="accept-terms" className="text-xs text-on-surface-variant select-none">
                I accept the
                <a href="#" className="text-on-surface-variant mx-1 hover:text-primary-container transition-colors">Terms &amp; Conditions</a>
                &amp;
                <a href="#" className="text-on-surface-variant mx-1 hover:text-primary-container transition-colors">Privacy Policy</a>
              </label>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="w-full cursor-pointer bg-primary-container text-on-primary-container font-bold py-3 rounded-xl inner-glow shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait..." : "Continue"}
            </motion.button>
          </form>

          <p className="text-center text-sm text-on-surface-variant opacity-60">
            OTP verification required
          </p>

          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-on-surface-variant opacity-50">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </motion.div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex cursor-pointer items-center justify-center gap-3 bg-surface-container-lowest border border-white/10 rounded-xl py-3 font-semibold text-on-surface hover:border-white/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

        </motion.section>

        {/* Trust badges */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="w-full max-w-md grid grid-cols-3 gap-stack-gap-sm mt-stack-gap-lg"
        >
          <motion.div variants={fadeUp}>
            <TrustBadge icon="auto_awesome" label="INSTANT REPORT" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <TrustBadge icon="encrypted" label="SECURE LOGIN" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <TrustBadge icon="verified_user" label="10K+ USERS" />
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}




