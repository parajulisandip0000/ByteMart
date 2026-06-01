import { Head } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

import { StorefrontLayout } from '@/components/layout/storefront-layout';

interface ContentPageProps extends PropsWithChildren {
    eyebrow: string;
    title: string;
    description: string;
}

export function ContentPage({
    eyebrow,
    title,
    description,
    children,
}: ContentPageProps) {
    return (
        <>
            <Head title={title} />
            <StorefrontLayout>
                <section className="bg-brand-sky/60">
                    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                        <p className="text-xs font-black tracking-[0.2em] text-brand-orange uppercase">
                            {eyebrow}
                        </p>
                        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                            {title}
                        </h1>
                        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                            {description}
                        </p>
                    </div>
                </section>
                <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-5">{children}</div>
                </section>
            </StorefrontLayout>
        </>
    );
}

export function ContentBlock({
    title,
    children,
}: PropsWithChildren<{ title: string }>) {
    return (
        <article className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">{title}</h2>
            <div className="mt-3 leading-7 text-slate-600">{children}</div>
        </article>
    );
}
