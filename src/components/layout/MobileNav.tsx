import Link from 'next/link'
import React from 'react'

type MobileNavActive = 'home' | 'divine' | 'reports' | 'profile'

const MobileNav = ({ active }: { active: MobileNavActive }) => {
    return (
        <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around bg-[#1a1a1a00] px-4 py-3 backdrop-blur-xl">
            <div className='max-w-min mx-auto flex gap-6 items-center justify-between'>
                <Link href="/" className={`flex flex-col items-center justify-center transition-all px-3 py-1 rounded-xl ${active === 'home' ? 'bg-[#f2ca50]/10  text-[#f2ca50]' : 'text-[#d0c5af] hover:bg-white/5'}`}>
                    <span className={`material-symbols-outlined ${active === 'home' ? "[font-variation-settings:'FILL'_1]" : ''}`}>home</span>
                    <span className="text-[12px] font-bold tracking-[0.05em]">Home</span>
                </Link>
                <Link href="/vehicle-numerology" className={`flex flex-col items-center justify-center transition-all px-3 py-1 rounded-xl ${active === 'divine' ? 'bg-[#f2ca50]/10  text-[#f2ca50]' : 'text-[#d0c5af] hover:bg-white/5'}`}>
                    <span className={`material-symbols-outlined ${active === 'divine' ? "[font-variation-settings:'FILL'_1]" : ''}`}>flare</span>
                    <span className="text-[12px] font-bold tracking-[0.05em]">Divine</span>
                </Link>
                <Link href="/report" className={`flex flex-col items-center justify-center transition-all px-3 py-1 rounded-xl ${active === 'reports' ? 'bg-[#f2ca50]/10  text-[#f2ca50]' : 'text-[#d0c5af] hover:bg-white/5'}`}>
                    <span className={`material-symbols-outlined ${active === 'reports' ? "[font-variation-settings:'FILL'_1]" : ''}`}>assessment</span>
                    <span className="text-[12px] font-bold tracking-[0.05em]">Reports</span>
                </Link>
                <Link href="/profile" className={`flex flex-col items-center justify-center transition-all px-3 py-1 rounded-xl ${active === 'profile' ? 'bg-[#f2ca50]/10  text-[#f2ca50]' : 'text-[#d0c5af] hover:bg-white/5'}`}>
                    <span className={`material-symbols-outlined ${active === 'profile' ? "[font-variation-settings:'FILL'_1]" : ''}`}>person</span>
                    <span className="text-[12px] font-bold tracking-[0.05em]">Profile</span>
                </Link>
            </div>
        </nav>
    )
}

export default MobileNav