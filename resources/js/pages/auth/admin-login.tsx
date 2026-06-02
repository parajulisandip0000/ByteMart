import { Head, Link, useForm } from '@inertiajs/react';
import { LockKeyhole, ShieldCheck, ShoppingBag } from 'lucide-react';
import type { FormEvent } from 'react';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function AdminLogin() {
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/admin/login', {
            onFinish: () => form.reset('password'),
        });
    };

    return (
        <>
            <Head title="Admin login" />
            <main className="grid min-h-screen bg-slate-950 lg:grid-cols-[1fr_520px]">
                <section className="hidden items-center px-12 lg:flex xl:px-20">
                    <div className="max-w-2xl">
                        <p className="text-xs font-black tracking-[0.24em] text-brand-orange uppercase">
                            ByteMart administration
                        </p>
                        <h1 className="mt-5 text-5xl font-black tracking-tight text-white xl:text-6xl">
                            Manage store operations from one secure workspace.
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                            Maintain products, inventory, orders, customer
                            access, reviews, and activity logs.
                        </p>
                        <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-2">
                            <Benefit text="Role-protected admin access" />
                            <Benefit text="Audited management actions" />
                        </div>
                    </div>
                </section>
                <section className="flex items-center bg-white px-5 py-12 sm:px-10">
                    <div className="mx-auto w-full max-w-md">
                        <Link
                            href="/"
                            className="flex items-center gap-3 text-brand-blue"
                        >
                            <span className="grid size-11 place-items-center rounded-xl bg-brand-orange text-white">
                                <ShoppingBag className="size-5" />
                            </span>
                            <span className="text-2xl font-black tracking-tight">
                                Byte
                                <span className="text-brand-orange">Mart</span>
                            </span>
                        </Link>
                        <p className="mt-10 text-xs font-black tracking-[0.2em] text-brand-orange uppercase">
                            Admin portal
                        </p>
                        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                            Administrator sign in
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            Use an authorized administrator account. Customer
                            accounts cannot access this portal.
                        </p>
                        <form onSubmit={submit} className="mt-8 grid gap-5">
                            <label className="grid gap-2 text-sm font-bold text-slate-700">
                                Email address
                                <Input
                                    type="email"
                                    value={form.data.email}
                                    onChange={(event) =>
                                        form.setData(
                                            'email',
                                            event.target.value,
                                        )
                                    }
                                    autoComplete="email"
                                    autoFocus
                                    required
                                    className="h-11"
                                />
                                <InputError message={form.errors.email} />
                            </label>
                            <label className="grid gap-2 text-sm font-bold text-slate-700">
                                Password
                                <PasswordInput
                                    value={form.data.password}
                                    onChange={(event) =>
                                        form.setData(
                                            'password',
                                            event.target.value,
                                        )
                                    }
                                    autoComplete="current-password"
                                    required
                                    className="h-11"
                                />
                                <InputError message={form.errors.password} />
                            </label>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="admin-remember"
                                    checked={form.data.remember}
                                    onCheckedChange={(checked) =>
                                        form.setData(
                                            'remember',
                                            checked === true,
                                        )
                                    }
                                />
                                <Label htmlFor="admin-remember">
                                    Remember me
                                </Label>
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                disabled={form.processing}
                                className="mt-2 bg-brand-orange font-bold hover:bg-orange-600"
                            >
                                {form.processing ? (
                                    <Spinner />
                                ) : (
                                    <LockKeyhole />
                                )}
                                Sign in to admin portal
                            </Button>
                        </form>
                        <p className="mt-7 text-center text-sm text-slate-500">
                            Shopping account?{' '}
                            <Link
                                href="/login"
                                className="font-bold text-brand-blue hover:text-brand-orange"
                            >
                                Customer login
                            </Link>
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
}

function Benefit({ text }: { text: string }) {
    return (
        <p className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-bold text-slate-200">
            <ShieldCheck className="size-5 shrink-0 text-brand-yellow" />
            {text}
        </p>
    );
}
