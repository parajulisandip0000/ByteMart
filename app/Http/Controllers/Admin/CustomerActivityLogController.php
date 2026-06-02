<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Inertia\Inertia;
use Inertia\Response;

class CustomerActivityLogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/customer-logs/index', [
            'logs' => ActivityLog::whereIn('actor_type', ['customer', 'guest'])
                ->latest()
                ->paginate(25)
                ->through(fn (ActivityLog $log) => [
                    'id' => $log->id,
                    'action' => $log->action,
                    'description' => $log->description,
                    'actorType' => $log->actor_type,
                    'name' => $log->actor_name ?? 'Guest customer',
                    'email' => $log->actor_email,
                    'ipAddress' => $log->ip_address,
                    'createdAt' => $log->created_at->toDateTimeString(),
                ]),
        ]);
    }
}
