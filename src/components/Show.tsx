import React from 'react'

const Show = ({ when, children }: { when: boolean, children: React.ReactNode }) => {
    if (!when) return null;
    return (
        <div>{children}</div>
    )
}

export default Show