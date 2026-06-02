import { Link } from '@inertiajs/react';
import { Heart, ShieldCheck, Truck } from 'lucide-react';

import { StorefrontFooter } from '@/components/layout/storefront-footer';
import { StorefrontHeader } from '@/components/layout/storefront-header';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <>
            <StorefrontHeader />
            <main className="bg-slate-50">
                <section className="mx-auto grid min-h-[680px] max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_460px] lg:items-center lg:px-8 lg:py-16">
                    <div className="hidden lg:block">
                        <p className="text-xs font-black tracking-[0.2em] text-brand-orange uppercase">
                            ByteMart account
                        </p>
                        <h1 className="mt-4 max-w-xl text-5xl font-black tracking-tight text-slate-950">
                            Your shopping experience, all in one place.
                        </h1>
                        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                            Sign in to manage your account and keep your
                            ByteMart shopping experience organized.
                        </p>
                        <div className="mt-9 grid max-w-xl gap-4">
                            <AccountBenefit
                                icon={<Heart />}
                                title="Keep your favorites close"
                                description="Return to the products you are considering without searching again."
                            />
                            <AccountBenefit
                                icon={<Truck />}
                                title="Stay ready for delivery"
                                description="Keep your customer details organized for a smoother checkout experience."
                            />
                            <AccountBenefit
                                icon={<ShieldCheck />}
                                title="Shop with confidence"
                                description="Use your ByteMart account with secure authentication options."
                            />
                        </div>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9">
                        <div className="flex flex-col gap-7">
                            <div>
                                <Link
                                    href="/"
                                    className="text-2xl font-black tracking-tight text-brand-blue"
                                >
                                    Byte
                                    <span className="text-brand-orange">
                                        Mart
                                    </span>
                                </Link>
                                <p className="mt-5 text-xs font-black tracking-[0.2em] text-brand-orange uppercase lg:hidden">
                                    ByteMart account
                                </p>
                                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                                    {title}
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {description}
                                </p>
                            </div>
                            {children}
                        </div>
                    </div>
                </section>
            </main>
            <StorefrontFooter />
        </>
    );
}

function AccountBenefit({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-sky/50 text-brand-blue [&_svg]:size-5">
                {icon}
            </span>
            <p>
                <strong className="block text-slate-900">{title}</strong>
                <span className="mt-1 block text-sm leading-6 text-slate-500">
                    {description}
                </span>
            </p>
        </div>
    );
}
