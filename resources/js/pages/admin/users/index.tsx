import { Head, router, useForm } from '@inertiajs/react';
import { Search } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import { AdminPageHeader } from '@/components/admin/page-header';
import { Pagination } from '@/components/admin/pagination';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface UserRow {
    id: number;
    name: string;
    email: string;
    role: 'customer' | 'admin' | 'manager';
    isActive: boolean;
    permissions: string[];
    verifiedAt: string | null;
    createdAt: string;
}

interface Users {
    data: UserRow[];
    links: { url: string | null; label: string; active: boolean }[];
}

const AVAILABLE_PERMISSIONS = [
    { value: 'products', label: 'Products Management' },
    { value: 'categories', label: 'Categories Management' },
    { value: 'orders', label: 'Orders Management' },
    { value: 'users', label: 'User Accounts Management' },
    { value: 'reviews', label: 'Product Reviews Moderation' },
    { value: 'logs', label: 'System Activity Logs' },
    { value: 'customer-logs', label: 'Customer Session Logs' },
];

export default function UsersIndex({
    users,
    filters,
}: {
    users: Users;
    filters: { search: string; type: 'staff' | 'customer' };
}) {
    const search = useForm({
        search: filters.search ?? '',
        type: filters.type ?? 'customer',
    });
    const currentType = search.data.type;

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isPermOpen, setIsPermOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserRow | null>(null);

    const addForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'manager' as 'admin' | 'manager',
        permissions: [] as string[],
    });

    const permForm = useForm({
        permissions: [] as string[],
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        search.get('/admin/users', {
            preserveState: true,
        });
    };

    const handleTypeChange = (newType: 'staff' | 'customer') => {
        search.setData('type', newType);
        router.get('/admin/users', {
            type: newType,
            search: search.data.search,
        });
    };

    const submitAdd = (e: FormEvent) => {
        e.preventDefault();
        addForm.post('/admin/users', {
            onSuccess: () => {
                addForm.reset();
                setIsAddOpen(false);
            },
        });
    };

    const openPermissions = (user: UserRow) => {
        setEditingUser(user);
        permForm.setData('permissions', user.permissions);
        setIsPermOpen(true);
    };

    const submitPerms = (e: FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            permForm.patch(`/admin/users/${editingUser.id}`, {
                onSuccess: () => {
                    setIsPermOpen(false);
                    setEditingUser(null);
                },
            });
        }
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

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <form
                    onSubmit={submit}
                    className="flex max-w-xl flex-1 gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                    <Search className="mt-2 size-5 text-slate-400 shrink-0" />
                    <input
                        value={search.data.search}
                        onChange={(event) =>
                            search.setData('search', event.target.value)
                        }
                        placeholder="Search name or email"
                        className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none font-bold"
                    />
                    <Button type="submit" className="bg-brand-blue font-bold">
                        Search
                    </Button>
                </form>

                {currentType === 'staff' && (
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-brand-orange font-bold rounded-2xl py-6 px-6 shadow-sm hover:bg-brand-orange/90">
                                Add Staff User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md rounded-2xl p-6 bg-white">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black text-slate-950">Add Staff Account</DialogTitle>
                                <DialogDescription className="text-slate-500 font-semibold">Create a new administrator or manager account.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={submitAdd} className="mt-4 grid gap-4">
                                <label className="text-xs font-black text-slate-700 uppercase block">
                                    Name
                                    <input
                                        type="text"
                                        required
                                        value={addForm.data.name}
                                        onChange={(e) => addForm.setData('name', e.target.value)}
                                        className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-normal outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                                    />
                                    {addForm.errors.name && <span className="mt-1 block text-xs text-red-600 font-semibold">{addForm.errors.name}</span>}
                                </label>

                                <label className="text-xs font-black text-slate-700 uppercase block">
                                    Email
                                    <input
                                        type="email"
                                        required
                                        value={addForm.data.email}
                                        onChange={(e) => addForm.setData('email', e.target.value)}
                                        className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-normal outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                                    />
                                    {addForm.errors.email && <span className="mt-1 block text-xs text-red-600 font-semibold">{addForm.errors.email}</span>}
                                </label>

                                <label className="text-xs font-black text-slate-700 uppercase block">
                                    Password
                                    <input
                                        type="password"
                                        required
                                        minLength={8}
                                        value={addForm.data.password}
                                        onChange={(e) => addForm.setData('password', e.target.value)}
                                        className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-normal outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                                    />
                                    {addForm.errors.password && <span className="mt-1 block text-xs text-red-600 font-semibold">{addForm.errors.password}</span>}
                                </label>

                                <label className="text-xs font-black text-slate-700 uppercase block">
                                    Role
                                    <select
                                        value={addForm.data.role}
                                        onChange={(e) => addForm.setData('role', e.target.value as any)}
                                        className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-normal outline-none focus:border-brand-blue bg-white"
                                    >
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    {addForm.errors.role && <span className="mt-1 block text-xs text-red-600 font-semibold">{addForm.errors.role}</span>}
                                </label>

                                {addForm.data.role === 'manager' && (
                                    <div className="mt-1 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                                        <span className="block text-xs font-black text-slate-700 uppercase mb-2">Permissions</span>
                                        <div className="grid gap-2 max-h-[150px] overflow-y-auto pr-1">
                                            {AVAILABLE_PERMISSIONS.map((perm) => (
                                                <label key={perm.value} className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={addForm.data.permissions.includes(perm.value)}
                                                        onChange={(e) => {
                                                            addForm.setData(
                                                                'permissions',
                                                                e.target.checked
                                                                    ? [...addForm.data.permissions, perm.value]
                                                                    : addForm.data.permissions.filter((x) => x !== perm.value)
                                                            );
                                                        }}
                                                        className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                                                    />
                                                    {perm.label}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4">
                                    <Button type="submit" disabled={addForm.processing} className="bg-brand-blue font-bold">
                                        Create User
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

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
                                    <div className="flex justify-end gap-2">
                                        {user.role === 'manager' && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
                                                onClick={() => openPermissions(user)}
                                            >
                                                Permissions
                                            </Button>
                                        )}
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
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination links={users.links} />

            {/* Edit Permissions Modal */}
            <Dialog open={isPermOpen} onOpenChange={setIsPermOpen}>
                <DialogContent className="max-w-md rounded-2xl p-6 bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-slate-950">Edit Permissions</DialogTitle>
                        <DialogDescription className="text-slate-500 font-semibold">
                            Update permissions for <strong className="text-slate-800">{editingUser?.name}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitPerms} className="mt-4 grid gap-4">
                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                            <span className="block text-xs font-black text-slate-700 uppercase mb-2">Permissions</span>
                            <div className="grid gap-2 max-h-[200px] overflow-y-auto pr-1">
                                {AVAILABLE_PERMISSIONS.map((perm) => (
                                    <label key={perm.value} className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={permForm.data.permissions.includes(perm.value)}
                                            onChange={(e) => {
                                                permForm.setData(
                                                    'permissions',
                                                    e.target.checked
                                                        ? [...permForm.data.permissions, perm.value]
                                                        : permForm.data.permissions.filter((x) => x !== perm.value)
                                                );
                                            }}
                                            className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                                        />
                                        {perm.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4">
                            <Button type="submit" disabled={permForm.processing} className="bg-brand-blue font-bold">
                                Save Changes
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setIsPermOpen(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
