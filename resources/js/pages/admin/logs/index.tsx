import { Head } from '@inertiajs/react';

import { AdminPageHeader } from '@/components/admin/page-header';
import { Pagination } from '@/components/admin/pagination';

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

export default function LogsIndex({ logs }: { logs: Logs }) {
    return (
        <>
            <Head title="Activity logs" />
            <AdminPageHeader
                eyebrow="Audit history"
                title="Activity logs"
                description="Track administrative changes with the responsible account, action type, source IP address, and timestamp."
            />
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
