interface SectionHeadingProps {
    eyebrow?: string;
    title: string;
    description?: string;
}

export function SectionHeading({
    eyebrow,
    title,
    description,
}: SectionHeadingProps) {
    return (
        <div className="mb-7">
            {eyebrow && (
                <p className="mb-2 text-xs font-extrabold tracking-[0.2em] text-brand-orange uppercase">
                    {eyebrow}
                </p>
            )}
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {title}
            </h2>
            {description && (
                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                    {description}
                </p>
            )}
        </div>
    );
}
