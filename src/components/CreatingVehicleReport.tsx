'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';

const steps = [
    'Extracting plate digits',
    'Computing life path number',
    'Mapping cosmic patterns',
    'Aligning destiny matrix',
];

const particles = [
    { n: '8', offset: 0, radius: 115, speed: Math.PI / 6 },
    { n: '3', offset: (2 * Math.PI) / 3, radius: 90, speed: Math.PI / 6 },
    { n: '1', offset: (8 * Math.PI) / 6, radius: 125, speed: Math.PI / 6 },
];

function OrbitParticle({ n, offset, radius, speed }: { n: string; offset: number; radius: number; speed: number }) {
    const angle = useMotionValue(offset);
    const x = useTransform(angle, (a) => Math.cos(a) * radius);
    const y = useTransform(angle, (a) => Math.sin(a) * radius);

    useAnimationFrame((_, delta) => {
        angle.set(angle.get() + (delta / 1000) * speed);
    });

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
                className="glass-card px-3 py-1 rounded-full"
                style={{ x, y }}
                suppressHydrationWarning
            >
                <span className="font-[JetBrains_Mono] text-sm text-primary">{n}</span>
            </motion.div>
        </div>
    );
}

const CreatingVehicleReport = ({ onComplete }: { onComplete?: () => void }) => {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep(prev => {
                if (prev < steps.length) return prev + 1;
                clearInterval(interval);
                return prev;
            });
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeStep === steps.length) {
            onComplete?.();
        }
    }, [activeStep, onComplete]);

    return (
        <>
            <section className="flex flex-col items-center justify-center pt-8 px-container-margin overflow-hidden relative"
            >
                {/* Scanner UI */}
                <div className="w-full max-w-md mx-auto relative z-10 flex flex-col items-center justify-center" >
                    {/* Rings container */}
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        {/* Outer animated ring */}
                        <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ring" />
                        {/* Middle dashed ring */}
                        <div className="absolute inset-4 rounded-full border border-dashed border-primary/40 rotate-12" />
                        {/* Inner glow */}
                        <div className="absolute inset-12 rounded-full bg-primary/10 blur-2xl" />
                        {/* Core scanner */}
                        <div
                            className="relative w-32 h-32 rounded-full glass-card flex items-center justify-center"
                            style={{ boxShadow: '0 0 30px rgba(242,202,80,0.3)', borderColor: 'rgba(242,202,80,0.4)' }}
                        >
                            <span
                                className="material-symbols-outlined text-primary"
                                style={{ fontVariationSettings: '"FILL" 1', fontSize: '48px' }}
                            >
                                flare
                            </span>
                        </div>
                        {/* Orbiting numerology symbols */}
                        {particles.map((p) => (
                            <OrbitParticle key={p.n} n={p.n} offset={p.offset} radius={p.radius} speed={p.speed} />
                        ))}
                    </div>

                    {/* Analysis text */}
                    <div className="mt-8 flex flex-col items-center gap-2 text-center">
                        <h2 className="font-[Montserrat] text-2xl font-semibold text-[#e5e2e1]">
                            Checking Vehicle <br /> Alignment...
                        </h2>
                        <p className="text-sm text-[#d0c5af] max-w-[280px]">
                            Our cosmic algorithm is processing thousands of data points to ensure your vehicle
                            matches your destiny.
                        </p>
                    </div>

                    <div className="glass-card px-6 py-3 mt-8 rounded-full flex items-center gap-4">
                        <span
                            className="material-symbols-outlined text-primary"
                            style={{ fontSize: '18px' }}
                        >
                            memory
                        </span>
                        <span className="font-[Inter] text-[12px] tracking-[0.05em] font-bold text-[#d0c5af] uppercase">
                            Quantum Analysis in Progress
                        </span>
                    </div>
                </div>

                {/* Analysis steps */}
                <div className="mt-8 w-full max-w-md flex flex-col gap-3" style={{ paddingLeft: '2.7rem' }}>
                    {steps.map((step, i) => {
                        const done = i < activeStep;
                        const active = i === activeStep;
                        return (
                            <div
                                key={step}
                                className={`flex items-center gap-3 transition-opacity duration-500 ${i > activeStep ? 'opacity-25' : 'opacity-100'}`}
                            >
                                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                    {done ? (
                                        <span
                                            className="material-symbols-outlined text-primary"
                                            style={{ fontSize: '18px', fontVariationSettings: '"FILL" 1' }}
                                        >
                                            check_circle
                                        </span>
                                    ) : active ? (
                                        <div
                                            className="w-2 h-2 rounded-full bg-primary animate-pulse"
                                            style={{ boxShadow: '0 0 8px #f2ca50' }}
                                        />
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-[#99907c]/40" />
                                    )}
                                </div>
                                <span className={`font-[Inter] text-[12px] tracking-[0.05em] font-bold uppercase ${done || active ? 'text-[#d0c5af]' : 'text-[#99907c]'}`}>
                                    {step}
                                </span>
                                {active && (
                                    <span className="font-[JetBrains_Mono] text-xs text-primary animate-pulse">
                                        ...
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </>
    );
};

export default CreatingVehicleReport;
