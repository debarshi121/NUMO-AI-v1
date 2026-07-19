"use client";

import { StarsIcon } from "@/components/Icons";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, type Variants } from "framer-motion";

const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const ProfileSetup = () => {
    const router = useRouter();
    const { data: session, update } = useSession();
    const [gender, setGender] = useState("male");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session?.user?.name]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const trimmedName = name.trim();
        const form = e.currentTarget;
        const dob = (form.elements.namedItem("dob") as HTMLInputElement).value;

        try {
            const { data } = await axios.post("/api/profile/setup", { name: trimmedName, dob, gender });
            if (!data.success) {
                setError(data.error ?? "Failed to save profile");
                return;
            }
            // Refresh JWT so the proxy sees profileSetup=true before navigating
            await update({ profileSetup: true });
            router.push("/vehicle-numerology");
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#0A0A0A] text-on-background min-h-screen flex flex-col relative" style={{
            backgroundImage:
                "radial-gradient(circle at 50% 40%, rgba(242, 202, 80, 0.1) 0%, rgba(10, 10, 10, 1) 60%)",
        }}>

            {/* Top Navigation Shell */}
            <header className="flex justify-center items-center w-full px-container-margin py-4 z-50">
                <h1 className="font-headline-md text-headline-md text-primary tracking-widest uppercase flex items-center gap-2">
                    <StarsIcon />
                    <span className="font-headline-alt text-body-lg font-bold leading-6 tracking-[-0.4px] normal-case">NUMO AI</span>
                </h1>
            </header>

            <main
                className="grow flex flex-col px-container-margin relative z-10 pt-8"
            >

                {/* Header Section */}
                <motion.section
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    className="w-full max-w-md mx-auto mb-stack-gap-lg text-center"
                >
                    <h2 className="text-2xl font-bold text-on-surface mb-4 mx-auto">
                        Personalize Your <br /> Numerology Profile
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Your birth details help generate accurate vehicle compatibility insights.
                    </p>
                </motion.section>

                {/* Onboarding Form Card */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={stagger}
                    className="w-full max-w-md mx-auto glass-card rounded-xl p-element-padding flex flex-col gap-stack-gap-md mb-24"
                >
                    <form onSubmit={handleSubmit} className="flex flex-col gap-stack-gap-md">
                        {/* Name Input */}
                        <motion.div variants={fadeUp} className="flex flex-col gap-2">
                            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase ml-1">
                                Full Name
                            </label>
                            <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl border border-white/10 px-4 py-3 focus-within:border-primary transition-colors">
                                <input
                                    name="name"
                                    className="bg-transparent border-none outline-none w-full text-on-surface placeholder:text-outline/40 p-0 text-base"
                                    placeholder="Enter Full Name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* DOB Picker */}
                        <motion.div variants={fadeUp} className="flex flex-col gap-2">
                            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase ml-1">
                                Date of Birth
                            </label>
                            <div className="relative flex items-center gap-2 bg-surface-container-lowest rounded-xl border border-white/10 px-4 py-3 focus-within:border-primary transition-colors">
                                <input
                                    name="dob"
                                    className="bg-transparent border-none outline-none w-full text-on-surface p-0 pr-8 text-base appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden"
                                    type="date"
                                    required
                                />
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                                    calendar_today
                                </span>
                            </div>
                        </motion.div>

                        {/* Gender Selection */}
                        <motion.div variants={fadeUp} className="flex flex-col gap-2">
                            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase ml-1">
                                Gender
                            </label>
                            <div className="grid grid-cols-3 gap-2 p-1 bg-surface-container-lowest rounded-xl border border-outline-variant/70 shadow-[inset_0_1px_0_rgba(242,202,80,0.08)]">
                                <button
                                    type="button"
                                    onClick={() => setGender("male")}
                                    className={`cursor-pointer py-2.5 rounded-lg font-label-caps text-label-caps uppercase transition-colors ${gender === "male" ? "bg-primary-container text-on-primary-container shadow-[0_0_0_1px_rgba(242,202,80,0.15)]" : "text-on-surface-variant hover:bg-surface-container"}`}
                                >
                                    Male
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGender("female")}
                                    className={`cursor-pointer py-2.5 rounded-lg font-label-caps text-label-caps uppercase transition-colors ${gender === "female" ? "bg-primary-container text-on-primary-container shadow-[0_0_0_1px_rgba(242,202,80,0.15)]" : "text-on-surface-variant hover:bg-surface-container"}`}
                                >
                                    Female
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGender("other")}
                                    className={`cursor-pointer py-2.5 rounded-lg font-label-caps text-label-caps uppercase transition-colors ${gender === "other" ? "bg-primary-container text-on-primary-container shadow-[0_0_0_1px_rgba(242,202,80,0.15)]" : "text-on-surface-variant hover:bg-surface-container"}`}
                                >
                                    Other
                                </button>
                            </div>
                        </motion.div>

                        {/* Privacy Note */}
                        <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mt-2 py-2">
                            <span className="material-symbols-outlined text-body-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                                lock
                            </span>
                            <p className="font-body-sm text-label-caps text-on-surface-variant">
                                Your information is securely encrypted and never shared.
                            </p>
                        </motion.div>

                        {error && (
                            <p className="text-sm text-red-400 text-center">{error}</p>
                        )}

                        <motion.div variants={fadeUp}>
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                className="w-full cursor-pointer bg-primary-container text-on-primary-container font-bold py-3 rounded-xl inner-glow shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Saving..." : "CALIBRATE PROFILE"}
                            </motion.button>
                        </motion.div>
                    </form>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default ProfileSetup;