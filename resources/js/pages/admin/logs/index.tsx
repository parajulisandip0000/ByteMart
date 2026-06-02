import { Head, useForm } from '@inertiajs/react';
import { Search } from 'lucide-react';
import type { FormEvent } from 'react';

import { AdminPageHeader } from '@/components/admin/page-header';
import { Pagination } from '@/components/admin/pagination';
import { Button } from '@/components/ui/button';

interface Log {
    id: number;
    action: string;
    description: string;
    user: string;
    email: string | null;
    ipAddress: string | null;
    createdAt: string;
}

interface Logs {
    data: Log[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function LogsIndex({
    logs,
    filters,
}: {
    logs: Logs;
    filters: { search: string };
}) {
    const search = useForm({ search: filters?.search ?? '' });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        search.get('/admin/logs', { preserveState: true });
    };

    return (
        <>
            <Head title="Activity logs" />
            <AdminPageHeader
                eyebrow="Audit history"
                title="Activity logs"
                description="Track administrative changes with the responsible account, action type, source IP address, and timestamp."
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
                    placeholder="Search logs"
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
                            <th className="px-4 py-3">Action</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Administrator</th>
                            <th className="px-4 py-3">IP address</th>
                            <th className="px-4 py-3">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.data.map((log) => (
                            <tr key={log.id}>
                                <td className="px-4 py-3 font-black text-brand-blue">
                                    {log.action}
                                </td>
                                <td className="px-4 py-3">{log.description}</td>
                                <td className="px-4 py-3">
                                    <p className="font-bold">{log.user}</p>
                                    <p className="text-xs text-slate-400">
                                        {log.email}
                                    </p>
                                </td>
                                <td className="px-4 py-3 text-slate-500">
                                    {log.ipAddress ?? 'Unknown'}
                                </td>
                                <td className="px-4 py-3 text-slate-500">
                                    {log.createdAt}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.data.length === 0 && (
                    <p className="p-6 text-sm text-slate-500">
                        Admin actions will appear here as changes are made.
                    </p>
                )}
            </div>
            <Pagination links={logs.links} />
        </>
    );
}
