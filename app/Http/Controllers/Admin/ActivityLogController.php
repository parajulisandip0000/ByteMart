<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/logs/index', [
            'logs' => ActivityLog::where('actor_type', 'admin')->with('user:id,name,email')->latest()->paginate(25)->through(fn (ActivityLog $log) => [
                'id' => $log->id,
                'action' => $log->action,
                'description' => $log->description,
                'user' => $log->user?->name ?? 'System',
                'email' => $log->user?->email,
                'ipAddress' => $log->ip_address,
                'createdAt' => $log->created_at->toDateTimeString(),
            ]),
        ]);
    }
}
