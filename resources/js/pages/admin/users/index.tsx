import { Head, router, useForm } from '@inertiajs/react';
import { Search } from 'lucide-react';
import type { FormEvent } from 'react';

import { AdminPageHeader } from '@/components/admin/page-header';
import { Pagination } from '@/components/admin/pagination';
import { Button } from '@/components/ui/button';

interface UserRow {
    id: number;
    name: string;
    email: string;
    role: 'customer' | 'admin';
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
    filters: { search: string };
}) {
    const search = useForm({ search: filters.search });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        search.get('/admin/users', { preserveState: true });
    };

    return (
        <>
            <Head title="Manage customers" />
            <AdminPageHeader
                eyebrow="Accounts"
                title="Customers and administrators"
                description="Review registered accounts and control access to the ByteMart admin portal."
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
                    placeholder="Search name or email"
                    className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none"
                />
                <Button type="submit" className="bg-brand-blue font-bold">
                    Search
                </Button>
            </form>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-3xl text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                        <tr>
                            <th className="px-4 py-3">Account</th>
                            <th className="px-4 py-3">Verified</th>
                            <th className="px-4 py-3">Joined</th>
                            <th className="px-4 py-3">Role</th>
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
                                        <option value="admin">Admin</option>
                                    </select>
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
