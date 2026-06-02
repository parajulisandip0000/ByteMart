import type { ReactNode } from 'react';

export function AdminPageHeader({
    eyebrow,
    title,
    description,
    actions,
}: {
    eyebrow: string;
    title: string;
    description: string;
    actions?: ReactNode;
}) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
                <p className="text-xs font-black tracking-[0.2em] text-brand-orange uppercase">
                    {eyebrow}
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                    {title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                    {description}
                </p>
            </div>
            {actions}
        </div>
    );
}
