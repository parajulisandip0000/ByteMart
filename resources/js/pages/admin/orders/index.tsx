import { Head, router, useForm } from '@inertiajs/react';
import { Search } from 'lucide-react';
import type { FormEvent } from 'react';

import { AdminPageHeader } from '@/components/admin/page-header';
import { Pagination } from '@/components/admin/pagination';
import { Button } from '@/components/ui/button';
import { formatNpr } from '@/lib/currency';

interface OrderRow {
    id: number;
    reference: string;
    customerName: string;
    email: string;
    phone: string;
    deliveryAddress: string;
    paymentMethod: string;
    status: string;
    itemsCount: number;
    total: string;
    createdAt: string;
}

interface Orders {
    data: OrderRow[];
    links: { url: string | null; label: string; active: boolean }[];
}

const statuses = [
    'received',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
];

export default function OrdersIndex({
    orders,
    filters,
}: {
    orders: Orders;
    filters: { search: string };
}) {
    const search = useForm({ search: filters?.search ?? '' });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        search.get('/admin/orders', { preserveState: true });
    };

    return (
        <>
            <Head title="Manage orders" />
            <AdminPageHeader
                eyebrow="Operations"
                title="Orders"
                description="Track COD orders from checkout and update fulfillment progress for the ByteMart team."
            />
            <form
                onSubmit={submit}
                className="mt-6 flex max-w-xl gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
            >
                <Search className="mt-2 size-5 text-slate-400" />
                <input
                    value={search.data.search}
                    onChange={(event) =>
                        search.setData('search', event.target.value)
                    }
                    placeholder="Search reference, customer, email or phone"
                    className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none"
                />
                <Button type="submit" className="bg-brand-blue font-bold">
                    Search
                </Button>
            </form>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-5xl text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                        <tr>
                            <th className="px-4 py-3">Order</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Delivery</th>
                            <th className="px-4 py-3">Items</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.data.map((order) => (
                            <tr key={order.id}>
                                <td className="px-4 py-3">
                                    <p className="font-black text-brand-blue">
                                        {order.reference}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {order.createdAt}
                                    </p>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-bold">
                                        {order.customerName}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {order.email} · {order.phone}
                                    </p>
                                </td>
                                <td className="max-w-64 px-4 py-3 text-slate-500">
                                    {order.deliveryAddress}
                                </td>
                                <td className="px-4 py-3">
                                    {order.itemsCount}
                                </td>
                                <td className="px-4 py-3 font-black">
                                    {formatNpr(order.total)}
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        value={order.status}
                                        onChange={(event) =>
                                            router.patch(
                                                `/admin/orders/${order.id}`,
                                                {
                                                    status: event.target.value,
                                                },
                                            )
                                        }
                                        className="rounded-lg border border-slate-200 px-2 py-1.5 font-bold capitalize"
                                    >
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.data.length === 0 && (
                    <p className="p-6 text-sm text-slate-500">
                        New checkout orders will appear here.
                    </p>
                )}
            </div>
            <Pagination links={orders.links} />
        </>
    );
}
