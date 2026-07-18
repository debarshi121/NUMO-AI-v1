import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[#0A0A0A] text-[#e5e2e1] antialiased"
            style={{
                backgroundImage: "radial-gradient(circle at 50% 50%, rgba(242, 202, 80, 0.08) 0%, transparent 55%), radial-gradient(circle at 50% 10%, #000000cb), url('/pngs/sky.png')",
                backgroundRepeat: "no-repeat, no-repeat, no-repeat",
                backgroundSize: "cover, cover, cover",
                backgroundPosition: "center, center, center 40%",
            }}
        >
            <Header />
            {children}
            <MobileNav active="divine" />
        </div>
    )
}

export default layout