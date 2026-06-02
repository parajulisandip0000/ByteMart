<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        return Inertia::render('admin/logs/index', [
            'logs' => ActivityLog::where('actor_type', 'admin')
                ->with('user:id,name,email')
                ->when($search, fn ($query) => $query
                    ->where(fn ($q) => $q
                        ->where('action', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($uq) => $uq
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                        )
                    )
                )
                ->latest()
                ->paginate(25)
                ->withQueryString()
                ->through(fn (ActivityLog $log) => [
                    'id' => $log->id,
                    'action' => $log->action,
                    'description' => $log->description,
                    'user' => $log->user?->name ?? 'System',
                    'email' => $log->user?->email,
                    'ipAddress' => $log->ip_address,
                    'createdAt' => $log->created_at->toDateTimeString(),
                ]),
            'filters' => ['search' => $search],
        ]);
    }
}
