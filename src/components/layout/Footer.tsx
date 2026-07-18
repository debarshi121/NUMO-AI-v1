import React from 'react'

const Footer = () => {
    return (
        <footer className="w-full py-4 px-container-margin border-t border-white/5 bg-surface-container-lowest">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-2">
                <a href="#" className="text-[10px] font-medium tracking-[0.05em] uppercase text-outline hover:text-primary transition-colors">
                    Privacy Policy
                </a>
                <a href="#" className="text-[10px] font-medium tracking-[0.05em] uppercase text-outline hover:text-primary transition-colors">
                    Terms &amp; Conditions
                </a>
                <a href="#" className="text-[10px] font-medium tracking-[0.05em] uppercase text-outline hover:text-primary transition-colors">
                    Support
                </a>
            </div>
            <p className="text-center text-[10px] text-outline/40">
                &copy; 2026 NUMO AI. ALL RIGHTS RESERVED.
            </p>
        </footer>
    )
}

export default Footer