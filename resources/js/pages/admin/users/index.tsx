import { Head, router, useForm } from '@inertiajs/react';
import { Search } from 'lucide-react';
import type { FormEvent } from 'react';

import { AdminPageHeader } from '@/components/admin/page-header';
import { Pagination } from '@/components/admin/pagination';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UserRow {
    id: number;
    name: string;
    email: string;
    role: 'customer' | 'admin' | 'manager';
    isActive: boolean;
    verifiedAt: string | null;
    createdAt: string;
}

interface Users {
    data: UserRow[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function UsersIndex({
    users,
    filters,
}: {
    users: Users;
    filters: { search: string; type: 'staff' | 'customer' };
}) {
    const search = useForm({ search: filters.search ?? '' });
    const currentType = filters.type ?? 'customer';

    const submit = (event: FormEvent) => {
        event.preventDefault();
        search.get('/admin/users', {
            preserveState: true,
            data: {
                search: search.data.search,
                type: currentType,
            },
        });
    };

    const handleTypeChange = (newType: 'staff' | 'customer') => {
        router.get('/admin/users', {
            type: newType,
            search: search.data.search,
        });
    };

    return (
        <>
            <Head title="Manage users" />
            <AdminPageHeader
                eyebrow="Accounts"
                title="Users"
                description="Review registered accounts, update roles, and control access to the ByteMart admin portal."
            />

            {/* Staff / Customer Selector Tabs */}
            <div className="mt-6 flex gap-2 border-b border-slate-200">
                <button
                    onClick={() => handleTypeChange('customer')}
                    className={cn(
                        'pb-3 text-sm font-extrabold border-b-2 px-4 transition-colors',
                        currentType === 'customer'
                            ? 'border-brand-blue text-brand-blue'
                            : 'border-transparent text-slate-500 hover:text-slate-800',
                    )}
                >
                    Customer Users
                </button>
                <button
                    onClick={() => handleTypeChange('staff')}
                    className={cn(
                        'pb-3 text-sm font-extrabold border-b-2 px-4 transition-colors',
                        currentType === 'staff'
                            ? 'border-brand-blue text-brand-blue'
                            : 'border-transparent text-slate-500 hover:text-slate-800',
                    )}
                >
                    Admin / Manager Users
                </button>
            </div>

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
                    placeholder="Search name or email"
                    className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none"
                />
                <Button type="submit" className="bg-brand-blue font-bold">
                    Search
                </Button>
            </form>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-4xl text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                        <tr>
                            <th className="px-4 py-3">Account</th>
                            <th className="px-4 py-3">Verified</th>
                            <th className="px-4 py-3">Joined</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.data.map((user) => (
                            <tr key={user.id}>
                                <td className="px-4 py-3">
                                    <p className="font-black">{user.name}</p>
                                    <p className="text-xs text-slate-500">
                                        {user.email}
                                    </p>
                                </td>
                                <td className="px-4 py-3 text-slate-500">
                                    {user.verifiedAt ? 'Yes' : 'Pending'}
                                </td>
                                <td className="px-4 py-3 text-slate-500">
                                    {user.createdAt}
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        value={user.role}
                                        onChange={(event) =>
                                            router.patch(
                                                `/admin/users/${user.id}`,
                                                { role: event.target.value },
                                            )
                                        }
                                        className="rounded-lg border border-slate-200 px-2 py-1.5 font-bold"
                                    >
                                        <option value="customer">
                                            Customer
                                        </option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={cn(
                                            'rounded-full px-2.5 py-1 text-xs font-black',
                                            user.isActive
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-red-100 text-red-700',
                                        )}
                                    >
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs font-bold"
                                        onClick={() =>
                                            router.patch(
                                                `/admin/users/${user.id}`,
                                                { is_active: !user.isActive },
                                            )
                                        }
                                    >
                                        {user.isActive
                                            ? 'Deactivate'
                                            : 'Activate'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination links={users.links} />
        </>
    );
}
