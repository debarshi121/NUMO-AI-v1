"use client";

import { useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, type Variants } from "framer-motion";
import {
  newVehicleFormSchema,
  type NewVehicleFormValues,
} from "@/lib/validation/vehicleForms";

const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const PURCHASE_MONTHS = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + i);
    return { label: d.toLocaleString('default', { month: 'short' }), year: d.getFullYear(), key: `${d.getFullYear()}-${d.getMonth()}` };
});

interface NewVehicleInsightsFormProps {
    onSubmit: (data: NewVehicleFormValues) => void;
}

export default function NewVehicleInsightsForm({ onSubmit }: NewVehicleInsightsFormProps) {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<NewVehicleFormValues>({
        resolver: zodResolver(newVehicleFormSchema),
        defaultValues: {
            dob: "",
            purchaseMonth: PURCHASE_MONTHS[0].key,
        },
    });

    useEffect(() => {
        axios.get("/api/profile")
            .then(({ data }) => {
                if (data.success && data.dob) {
                    setValue("dob", dayjs(data.dob).format("YYYY-MM-DD"));
                }
            })
            .catch(() => { /* silently ignore */ });
    }, [setValue]);

    return (
        <div className="w-full relative text-on-surface antialiased mx-auto px-container-margin">

            {/* Background Visuals */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="accent-glow top-1/4 -right-20"
                    animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.15, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="accent-glow bottom-1/4 -left-20"
                    animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.15, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
                <motion.span
                    className="floating-number text-[180px] leading-none absolute top-16 right-10"
                    animate={{ y: [0, -18, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                >
                    7
                </motion.span>
                <motion.span
                    className="floating-number text-[140px] leading-none absolute bottom-40 left-5"
                    animate={{ y: [0, 16, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                    3
                </motion.span>
                <motion.span
                    className="floating-number text-[200px] leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{ y: [0, -14, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                    8
                </motion.span>
            </div>

            {/* Main Content */}
            <main className="pt-8 pb-32 px-container-margin max-w-md mx-auto">

                {/* Hero Section */}
                <motion.section
                    initial="hidden"
                    animate="show"
                    variants={stagger}
                    className="text-center mb-stack-gap-lg"
                >
                    <motion.h2 variants={fadeUp} className="font-headline text-[40px] font-bold leading-[48px] tracking-[-0.02em] text-on-background mb-2">
                        Divine Alignment
                    </motion.h2>
                    <motion.p variants={fadeUp} className="font-body text-[16px] leading-6 text-on-surface-variant">
                        Sync your birth data with cosmic vehicle frequencies to find your perfect match.
                    </motion.p>
                </motion.section>

                {/* Form Card */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={stagger}
                    className="glass-card rounded-xl p-6 relative overflow-hidden"
                >
                    {/* Decorative top line */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                    <form className="space-y-stack-gap-md" onSubmit={handleSubmit(onSubmit)}>

                        {/* DOB Input */}
                        <motion.div variants={fadeUp} className="space-y-1">
                            <label className="font-body text-[12px] font-bold leading-4 tracking-[0.05em] uppercase text-on-surface-variant">
                                DATE OF BIRTH
                            </label>
                            <div className="relative mt-2">
                                <input
                                    type="date"
                                    {...register("dob")}
                                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 font-numeral text-[14px] leading-10 tracking-[0.1em] font-medium text-primary focus:outline-none focus:border-primary transition-all appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden"
                                />
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                                    calendar_today
                                </span>
                            </div>
                            <p className="font-body text-[14px] leading-5 text-outline italic">
                                Profile data synced via Celestial ID
                            </p>
                            {errors.dob && (
                                <p className="font-body text-[14px] leading-5 text-error">
                                    {errors.dob.message}
                                </p>
                            )}
                        </motion.div>

                        {/* Purchase Month */}
                        <motion.div variants={fadeUp} className="space-y-1 pt-4">
                            <label className="font-body text-[12px] font-bold leading-4 tracking-[0.05em] uppercase text-on-surface-variant">
                                PLANNING TO BUY IN
                            </label>
                            <Controller
                                control={control}
                                name="purchaseMonth"
                                render={({ field }) => (
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        {PURCHASE_MONTHS.map((m) => (
                                            <button
                                                key={m.key}
                                                type="button"
                                                onClick={() => field.onChange(m.key)}
                                                className={`glass-card cursor-pointer rounded-lg px-3 py-3 text-center transition-all ${field.value === m.key
                                                    ? "border-primary/40 bg-primary/5"
                                                    : "border-white/10 hover:border-white/30"
                                                    }`}
                                            >
                                                <span className={`font-body text-[14px] font-bold leading-4 tracking-[0.04em] block ${field.value === m.key ? "text-primary" : "text-on-background"
                                                    }`}>
                                                    {m.label}
                                                </span>
                                                <span className="font-body text-[12px] leading-4 text-on-surface-variant">
                                                    {m.year}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            />
                            {errors.purchaseMonth && (
                                <p className="font-body text-[14px] leading-5 text-error">
                                    {errors.purchaseMonth.message}
                                </p>
                            )}
                        </motion.div>

                        {/* CTA Button */}
                        <motion.button
                            type="submit"
                            variants={fadeUp}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            className="w-full cursor-pointer bg-primary py-4 px-2 rounded-xl font-headline text-[14px] font-semibold text-on-primary flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(242,202,80,0.3)] mt-8"
                        >
                            <span className="material-symbols-outlined">temp_preferences_custom</span>
                            Generate Insights
                        </motion.button>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
