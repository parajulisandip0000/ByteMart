<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        return Inertia::render('admin/customer-logs/index', [
            'logs' => ActivityLog::whereIn('actor_type', ['customer', 'guest'])
                ->when($search, fn ($query) => $query
                    ->where(fn ($q) => $q
                        ->where('action', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('actor_name', 'like', "%{$search}%")
                        ->orWhere('actor_email', 'like', "%{$search}%")
                    )
                )
                ->latest()
                ->paginate(25)
                ->withQueryString()
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
            'filters' => ['search' => $search],
        ]);
    }
}
