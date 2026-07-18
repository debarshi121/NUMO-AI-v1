import React from 'react'
import { StarsIcon } from '../Icons'

const Header = () => {
    return (
        <header className="flex w-full items-center justify-center px-container-margin py-4 z-50">
            <h1 className="font-headline-md text-headline-md text-primary tracking-widest uppercase flex items-center gap-2">
                <StarsIcon />
                <span className="font-headline-alt text-[16px] font-bold leading-6 tracking-[-0.4px] normal-case">
                    NUMO AI
                </span>
            </h1>
        </header>
    )
}

export default Header