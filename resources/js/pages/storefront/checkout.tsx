import { Head, Link } from '@inertiajs/react';
import {
    CreditCard,
    MapPin,
    Minus,
    PackageCheck,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Truck,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { StorefrontLayout } from '@/components/layout/storefront-layout';
import { Button } from '@/components/ui/button';
import { formatNpr } from '@/lib/currency';
import { useCart, useOrders } from '@/lib/storefront-storage';

interface CheckoutForm {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    notes: string;
    delivery: 'kathmandu' | 'outside';
    payment: 'cod';
}

type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>;

const initialForm: CheckoutForm = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Kathmandu',
    notes: '',
    delivery: 'kathmandu',
    payment: 'cod',
};

export default function Checkout() {
    const cart = useCart();
    const orders = useOrders();
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<CheckoutErrors>({});
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const deliveryFee =
        form.delivery === 'kathmandu' && cart.subtotal >= 2500
            ? 0
            : form.delivery === 'kathmandu'
              ? 100
              : 200;
    const total = cart.subtotal + deliveryFee;

    const updateForm = <T extends keyof CheckoutForm>(
        field: T,
        value: CheckoutForm[T],
    ) => {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const submitOrder = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextErrors = validateCheckout(form);

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);

            return;
        }

        const reference = `BM-${Date.now().toString().slice(-8)}`;

        orders.addItem({
            reference,
            createdAt: new Date().toISOString(),
            status: 'Order received',
            customerName: form.name.trim(),
            deliveryAddress: `${form.address.trim()}, ${form.city.trim()}`,
            deliveryLabel:
                form.delivery === 'kathmandu'
                    ? 'Kathmandu Valley'
                    : 'Outside Kathmandu Valley',
            paymentLabel: 'Cash on delivery',
            items: [...cart.items],
            subtotal: cart.subtotal,
            deliveryFee,
            total,
        });
        setOrderNumber(reference);
        cart.clear();
    };

    if (orderNumber) {
        return <OrderConfirmation orderNumber={orderNumber} />;
    }

    return (
        <>
            <Head title="Checkout" />
            <StorefrontLayout>
                <section className="border-b border-blue-800 bg-brand-blue text-white">
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <p className="text-xs font-black tracking-[0.2em] text-brand-yellow uppercase">
                            Secure checkout
                        </p>
                        <h1 className="mt-3 text-4xl font-black tracking-tight">
                            Complete your order
                        </h1>
                    </div>
                </section>
                <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    {cart.items.length > 0 ? (
                        <form
                            onSubmit={submitOrder}
                            className="grid gap-8 lg:grid-cols-[1fr_380px]"
                        >
                            <div className="grid gap-6">
                                <CheckoutCard
                                    icon={<MapPin />}
                                    title="Delivery details"
                                >
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <CheckoutField
                                            label="Full name"
                                            value={form.name}
                                            error={errors.name}
                                            onChange={(value) =>
                                                updateForm('name', value)
                                            }
                                        />
                                        <CheckoutField
                                            label="Email address"
                                            type="email"
                                            value={form.email}
                                            error={errors.email}
                                            onChange={(value) =>
                                                updateForm('email', value)
                                            }
                                        />
                                        <CheckoutField
                                            label="Phone number"
                                            value={form.phone}
                                            error={errors.phone}
                                            onChange={(value) =>
                                                updateForm('phone', value)
                                            }
                                        />
                                        <CheckoutField
                                            label="City"
                                            value={form.city}
                                            error={errors.city}
                                            onChange={(value) =>
                                                updateForm('city', value)
                                            }
                                        />
                                    </div>
                                    <CheckoutField
                                        label="Delivery address"
                                        value={form.address}
                                        error={errors.address}
                                        onChange={(value) =>
                                            updateForm('address', value)
                                        }
                                    />
                                    <label className="block text-sm font-bold text-slate-700">
                                        Order notes{' '}
                                        <span className="font-normal text-slate-400">
                                            (optional)
                                        </span>
                                        <textarea
                                            rows={3}
                                            value={form.notes}
                                            onChange={(event) =>
                                                updateForm(
                                                    'notes',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-normal outline-none focus:border-brand-cyan focus:ring-3 focus:ring-brand-sky/60"
                                            placeholder="Delivery instructions or landmarks"
                                        />
                                    </label>
                                </CheckoutCard>
                                <CheckoutCard
                                    icon={<Truck />}
                                    title="Delivery option"
                                >
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Choice
                                            active={
                                                form.delivery === 'kathmandu'
                                            }
                                            title="Kathmandu Valley"
                                            description="Free on orders over Rs. 2,500"
                                            price={
                                                cart.subtotal >= 2500
                                                    ? 'Free'
                                                    : formatNpr(100)
                                            }
                                            onClick={() =>
                                                updateForm(
                                                    'delivery',
                                                    'kathmandu',
                                                )
                                            }
                                        />
                                        <Choice
                                            active={form.delivery === 'outside'}
                                            title="Outside Valley"
                                            description="Standard delivery across Nepal"
                                            price={formatNpr(200)}
                                            onClick={() =>
                                                updateForm(
                                                    'delivery',
                                                    'outside',
                                                )
                                            }
                                        />
                                    </div>
                                </CheckoutCard>
                                <CheckoutCard
                                    icon={<CreditCard />}
                                    title="Payment method"
                                >
                                    <Choice
                                        active
                                        title="Cash on delivery"
                                        description="Pay when your ByteMart order arrives."
                                        price="Available"
                                    />
                                    <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                                        Online payments through eSewa and Khalti
                                        will be added after provider selection.
                                    </div>
                                </CheckoutCard>
                            </div>
                            <OrderSummary
                                subtotal={cart.subtotal}
                                deliveryFee={deliveryFee}
                                total={total}
                                items={cart.items}
                                setQuantity={cart.setQuantity}
                            />
                        </form>
                    ) : (
                        <EmptyCheckout />
                    )}
                </section>
            </StorefrontLayout>
        </>
    );
}

function CheckoutCard({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="flex items-center gap-3 text-xl font-black text-slate-950">
                <span className="grid size-10 place-items-center rounded-full bg-brand-sky/50 text-brand-blue [&_svg]:size-5">
                    {icon}
                </span>
                {title}
            </h2>
            <div className="mt-5 grid gap-4">{children}</div>
        </section>
    );
}

function CheckoutField({
    label,
    type = 'text',
    value,
    error,
    onChange,
}: {
    label: string;
    type?: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="block text-sm font-bold text-slate-700">
            {label}
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-normal outline-none focus:border-brand-cyan focus:ring-3 focus:ring-brand-sky/60"
            />
            {error && (
                <span className="mt-1 block text-xs font-semibold text-red-600">
                    {error}
                </span>
            )}
        </label>
    );
}

function Choice({
    active,
    title,
    description,
    price,
    onClick,
}: {
    active: boolean;
    title: string;
    description: string;
    price: string;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition ${
                active
                    ? 'border-brand-blue bg-brand-sky/20'
                    : 'border-slate-200 hover:border-brand-cyan'
            }`}
        >
            <span>
                <strong className="block text-sm text-slate-900">
                    {title}
                </strong>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {description}
                </span>
            </span>
            <span className="shrink-0 text-sm font-black text-brand-blue">
                {price}
            </span>
        </button>
    );
}

function OrderSummary({
    subtotal,
    deliveryFee,
    total,
    items,
    setQuantity,
}: {
    subtotal: number;
    deliveryFee: number;
    total: number;
    items: ReturnType<typeof useCart>['items'];
    setQuantity: ReturnType<typeof useCart>['setQuantity'];
}) {
    return (
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-4">
            <h2 className="text-xl font-black text-slate-950">Order summary</h2>
            <div className="mt-5 grid gap-4 border-b border-slate-200 pb-5">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                        <img
                            src={item.imageUrl ?? ''}
                            alt={item.name}
                            className="size-14 rounded-lg bg-slate-100 object-cover"
                        />
                        <div className="min-w-0 flex-1 text-sm">
                            <strong className="line-clamp-2 block text-slate-800">
                                {item.name}
                            </strong>
                            <div className="mt-2 flex w-fit items-center rounded-full border border-slate-200">
                                <button
                                    type="button"
                                    aria-label={`Decrease ${item.name} quantity`}
                                    onClick={() =>
                                        setQuantity(item.id, item.quantity - 1)
                                    }
                                    disabled={item.quantity === 1}
                                    className="p-1.5 text-slate-600 hover:text-brand-blue disabled:cursor-not-allowed disabled:text-slate-300"
                                >
                                    <Minus className="size-3" />
                                </button>
                                <span className="min-w-7 text-center text-xs font-black">
                                    {item.quantity}
                                </span>
                                <button
                                    type="button"
                                    aria-label={`Increase ${item.name} quantity`}
                                    onClick={() =>
                                        setQuantity(item.id, item.quantity + 1)
                                    }
                                    className="p-1.5 text-slate-600 hover:text-brand-blue"
                                >
                                    <Plus className="size-3" />
                                </button>
                            </div>
                        </div>
                        <strong className="text-sm text-brand-blue">
                            {formatNpr(Number(item.price) * item.quantity)}
                        </strong>
                    </div>
                ))}
            </div>
            <div className="grid gap-3 border-b border-slate-200 py-5 text-sm">
                <p className="flex justify-between">
                    <span className="text-slate-500">Subtotal</span>
                    <strong>{formatNpr(subtotal)}</strong>
                </p>
                <p className="flex justify-between">
                    <span className="text-slate-500">Delivery</span>
                    <strong>
                        {deliveryFee === 0 ? 'Free' : formatNpr(deliveryFee)}
                    </strong>
                </p>
            </div>
            <p className="mt-5 flex justify-between text-lg">
                <strong>Total</strong>
                <strong className="text-brand-blue">{formatNpr(total)}</strong>
            </p>
            <Button
                type="submit"
                size="lg"
                className="mt-6 w-full bg-brand-orange font-bold hover:bg-orange-600"
            >
                <ShieldCheck /> Place order
            </Button>
            <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                Your details are used only to process this order.
            </p>
        </aside>
    );
}

function EmptyCheckout() {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <ShoppingBag className="mx-auto size-14 text-brand-cyan" />
            <h2 className="mt-5 text-2xl font-black text-slate-950">
                Your cart is empty
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-slate-500">
                Add products before starting checkout.
            </p>
            <Button asChild className="mt-6 bg-brand-orange font-bold">
                <Link href="/shop">Browse products</Link>
            </Button>
        </div>
    );
}

function OrderConfirmation({ orderNumber }: { orderNumber: string }) {
    return (
        <>
            <Head title="Order confirmed" />
            <StorefrontLayout>
                <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
                    <PackageCheck className="mx-auto size-20 text-emerald-600" />
                    <p className="mt-6 text-xs font-black tracking-[0.2em] text-brand-orange uppercase">
                        Order received
                    </p>
                    <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                        Thank you for your order.
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
                        Your cash-on-delivery order reference is{' '}
                        <strong className="text-brand-blue">
                            {orderNumber}
                        </strong>
                        . The ByteMart team will confirm delivery details
                        shortly.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Button asChild className="bg-brand-orange font-bold">
                            <Link href="/shop">Continue shopping</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/">Return home</Link>
                        </Button>
                    </div>
                </section>
            </StorefrontLayout>
        </>
    );
}

function validateCheckout(form: CheckoutForm): CheckoutErrors {
    const errors: CheckoutErrors = {};

    if (form.name.trim().length < 2) {
        errors.name = 'Please enter your full name.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!/^[0-9+\-\s]{7,20}$/.test(form.phone.trim())) {
        errors.phone = 'Please enter a valid phone number.';
    }

    if (form.city.trim().length < 2) {
        errors.city = 'Please enter your city.';
    }

    if (form.address.trim().length < 5) {
        errors.address = 'Please enter your full delivery address.';
    }

    return errors;
}
