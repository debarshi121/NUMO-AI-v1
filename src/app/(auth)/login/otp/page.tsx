"use client";

import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { motion, type Variants } from "framer-motion";
import { StarsIcon } from "@/components/Icons";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30; // seconds

const MotionButton = motion.create(Button);

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// useSearchParams() opts this tree out of static rendering unless it's wrapped
// in a Suspense boundary, so the page export below only provides that boundary
// and the actual form lives in this inner component.
function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile") ?? "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect back if no mobile in query
  useEffect(() => {
    if (!mobile) router.replace("/login");
  }, [mobile, router]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const sendOtp = useCallback(async () => {
    setError("");
    try {
      const { data } = await axios.post("/api/auth/send-otp", { mobile });
      if (!data.success) {
        setError(data.error ?? "Failed to send OTP");
        return;
      }
      // In development, show the OTP for easy testing
      if (data.otp) setDevOtp(data.otp);
      setTimer(RESEND_COOLDOWN);
    } catch {
      setError("Network error. Please try again.");
    }
  }, [mobile]);

  // Send OTP on first mount
  useEffect(() => {
    if (mobile) sendOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length < OTP_LENGTH) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post("/api/auth/verify-otp", { mobile, otp: otpString });

      if (!data.success) {
        setError(data.error ?? "Invalid OTP");
        return;
      }

      router.push(data.redirectTo ?? "/vehicle-numerology");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setDevOtp(null);
    inputRefs.current[0]?.focus();
    await sendOtp();
  };

  return (
    <div
      className="bg-[#0A0A0A] text-on-background min-h-screen flex flex-col relative"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 40%, rgba(242, 202, 80, 0.1) 0%, rgba(10, 10, 10, 1) 60%)",
      }}
    >
      {/* Header */}
      <header className="flex justify-center items-center w-full px-container-margin py-4 z-50">
        <h1 className="font-headline-md text-headline-md text-primary tracking-widest uppercase flex items-center gap-2">
          <StarsIcon />
          <span className="font-headline-alt text-[16px] font-bold leading-6 tracking-[-0.4px] normal-case">
            NUMO AI
          </span>
        </h1>
      </header>

      <main className="flex-grow flex flex-col items-center px-container-margin pt-8 pb-24 relative z-10">
        {/* Title */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="w-full max-w-sm text-center mb-stack-gap-lg"
        >
          <h2 className="text-2xl font-bold text-on-surface mb-3">
            Verify Your Number
          </h2>
          <p className="text-body-sm text-on-surface-variant">
            OTP sent to{" "}
            <span className="text-primary font-semibold">+91 {mobile}</span>
          </p>
        </motion.section>

        {/* OTP Card */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={stagger}
          className="w-full max-w-sm glass-card rounded-3xl p-element-padding flex flex-col gap-stack-gap-md"
        >
          {/* Dev helper */}
          {devOtp && (
            <motion.div variants={fadeUp} className="px-4 py-2 text-center">
              <span className="text-xs text-on-surface-variant">Dev OTP: </span>
              <span className="text-primary font-bold font-mono tracking-widest">
                {devOtp}
              </span>
            </motion.div>
          )}

          {/* OTP inputs */}
          <motion.div variants={fadeUp} className="flex justify-center gap-3">
            {Array.from({ length: OTP_LENGTH }, (_, i) => (
              <Input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[i]}
                onChange={(e) => handleInput(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className="h-14 w-11 rounded-xl bg-surface-container-lowest p-0 text-center text-xl md:text-xl font-bold text-on-surface caret-primary"
                aria-label={`OTP digit ${i + 1}`}
              />
            ))}
          </motion.div>

          {/* Error */}
          {error && (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}

          {/* Verify button */}
          <MotionButton
            onClick={handleVerify}
            disabled={loading || otp.join("").length < OTP_LENGTH}
            size="lg"
            variants={fadeUp}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="h-12 w-full rounded-xl bg-primary-container font-headline font-semibold text-on-primary-container inner-glow shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </MotionButton>

          {/* Resend */}
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-1">
            {timer > 0 ? (
              <p className="text-sm text-on-surface-variant">
                Resend OTP in{" "}
                <span className="text-primary font-semibold">{timer}s</span>
              </p>
            ) : (
              <MotionButton
                type="button"
                variant="link"
                onClick={handleResend}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="h-auto p-0 text-sm font-semibold text-primary hover:text-primary-container"
              >
                Resend OTP
              </MotionButton>
            )}
          </motion.div>
        </motion.section>

        {/* Back to login */}
        <MotionButton
          type="button"
          variant="link"
          onClick={() => router.push("/login")}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="mt-stack-gap-lg h-auto p-0 text-sm text-on-surface-variant hover:text-on-surface"
        >
          ← Change number
        </MotionButton>
      </main>

      <Footer />
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense fallback={null}>
      <OtpForm />
    </Suspense>
  );
}
