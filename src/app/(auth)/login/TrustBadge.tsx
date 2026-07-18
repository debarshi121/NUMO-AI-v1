const TrustBadge = ({ icon, label }: { icon: string; label: string }) => {
    return (
        <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>
                    {icon}
                </span>
            </div>
            <p className="text-[10px] font-bold tracking-[0.05em] uppercase leading-tight text-on-surface-variant">
                {label}
            </p>
        </div>
    );
}

export default TrustBadge;