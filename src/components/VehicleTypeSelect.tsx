"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import React from 'react'
import axios from 'axios'
import { motion, type Variants } from 'framer-motion'
import { calculateBirthNumber } from '@/lib/numerology/calculators/numerology'
import { energyData } from '@/lib/numerology/data/energy'

const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
}

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

function buildVibrationMessage(isoDob: string): string | null {
    const [year, month, day] = isoDob.slice(0, 10).split('-').map(Number)
    // Construct from local calendar parts (not the ISO instant) so the
    // resulting birth number can't shift a day depending on the viewer's timezone.
    const birthNumber = calculateBirthNumber(new Date(year, month - 1, day))
    const entry = energyData[birthNumber as keyof typeof energyData]
    if (!entry) return null

    const qualities = entry.vehiclePreference.slice(0, 2).join(' and ')
    return `${entry.planet} is currently aligned with your Life Path ${birthNumber}, suggesting a vehicle with ${qualities} qualities.`
}

type VehicleTypeCardProps = {
    imageSrc: string
    imageAlt: string
    badge: string
    title: string
    icon: string
    description: React.ReactNode
    onClick?: () => void
}

const VehicleTypeCard = ({ imageSrc, imageAlt, badge, title, icon, description, onClick }: VehicleTypeCardProps) => (
    <motion.div
        onClick={onClick}
        variants={fadeUp}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[rgba(26, 26, 26, 0.23)] shadow-[0_0_0_1px_rgba(242,202,80,0.14),0_0_24px_rgba(242,202,80,0.16)] backdrop-blur-[20px] transition-colors active:border-[#f2ca50]/40"
    >
        <div className="relative h-40 overflow-hidden">
            <img alt={imageAlt} className="h-full w-full object-cover grayscale  transition-all duration-700" src={imageSrc} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#353534] to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div className="rounded border border-[#f2ca50]/30 bg-black/80 px-3 py-1 font-numeral text-sm tracking-[0.15em] text-[#f2ca50]">
                    {badge}
                </div>
            </div>
        </div>
        <div className="p-4">
            <div className="mb-2 flex items-start justify-between">
                <h4 className="font-headline text-[20px] font-semibold leading-7">{title}</h4>
                <span className="material-symbols-outlined text-[#f2ca50]">{icon}</span>
            </div>
            <p className="text-[14px] leading-5 text-[#d0c5af]">{description}</p>
        </div>
    </motion.div>
)


const VehicleTypeSelect = () => {
    const router = useRouter();
    const [vibration, setVibration] = useState<string | null>(null);

    useEffect(() => {
        axios.get('/api/profile')
            .then(({ data }) => {
                if (data?.success && data?.dob) {
                    setVibration(buildVibrationMessage(data.dob));
                }
            })
            .catch(() => { /* silently ignore */ });
    }, []);

    return (
        <div className="w-full mt-8 px-container-margin space-y-stack-gap-lg max-w-md mx-auto">
            <section className="relative py-8 text-center">
                <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-30">
                    <div className="h-full w-full max-w-lg bg-gradient-to-t from-transparent via-[#f2ca50]/10 to-transparent blur-3xl" />
                </div>
                <h2
                    className="animate-float-soft mx-auto mb-4 max-w-[360px] font-headline text-[32px] font-medium leading-[1.2]    tracking-[-0.02em] text-on-background"
                >
                    Find Your Perfect <br /> Vehicle Alignment
                </h2>
                <p className="mx-auto max-w-xs text-[16px] leading-6 text-on-surface-variant">
                    Harness cosmic data to sync your driving experience with your unique numeric vibration.
                </p>
            </section>

            <motion.div initial="hidden" animate="show" variants={stagger}>
                <div className="mt-4 grid gap-8">
                    <VehicleTypeCard
                        imageSrc="/pngs/new-vehicle.png"
                        imageAlt="Abstract Energy"
                        badge="NEW VEHICLE"
                        title="Find Lucky Options"
                        icon="auto_fix"
                        description="Discover colors, number plates & lucky buying date perfectly aligned with your birth date."
                        onClick={() => router.push('/vehicle-numerology/new')}
                    />
                    <VehicleTypeCard
                        imageSrc="/pngs/existing-vehicle.png"
                        imageAlt="Luxury Sports Car"
                        badge="OLD VEHICLE"
                        title="Check Old Vehicle"
                        icon="search_insights"
                        description="Analyze your current vehicle's numeric compatibility and energy aura."
                        onClick={() => router.push('/vehicle-numerology/old')}
                    />
                </div>

                <motion.section variants={fadeUp} className="mt-8 flex items-center gap-4 rounded-xl border border-white/10 bg-[#f2ca50]/5 p-4 backdrop-blur-[20px]">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#f2ca50]/20">
                        <span className="material-symbols-outlined text-[#f2ca50]">flare</span>
                    </div>
                    <div>
                        <span className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#f2ca50]">
                            Current Vibration
                        </span>
                        <p className="text-[14px] leading-5 text-[#e5e2e1]">
                            {vibration ?? "Complete your birth profile to reveal your current vehicle vibration."}
                        </p>
                    </div>
                </motion.section>
            </motion.div>
        </div>
    )
}

export default VehicleTypeSelect