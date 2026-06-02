<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $type = $request->string('type')->trim()->toString() ?: 'customer';
        if (!in_array($type, ['staff', 'customer'])) {
            $type = 'customer';
        }

        return Inertia::render('admin/users/index', [
            'users' => User::when($type === 'staff', fn ($query) => $query->whereIn('role', ['admin', 'manager']))
                ->when($type === 'customer', fn ($query) => $query->where('role', 'customer'))
                ->when($search, fn ($query) => $query
                    ->where(fn ($q) => $q
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                    )
                )
                ->latest()
                ->paginate(15)
                ->withQueryString()
                ->through(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'isActive' => $user->is_active,
                    'verifiedAt' => $user->email_verified_at?->toDateTimeString(),
                    'createdAt' => $user->created_at->toDateTimeString(),
                ]),
            'filters' => [
                'search' => $search,
                'type' => $type,
            ],
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'role' => ['nullable', Rule::in(['customer', 'admin', 'manager'])],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $roleChanged = false;
        $activeChanged = false;

        if (isset($data['role']) && $user->role !== $data['role']) {
            abort_if($request->user()->is($user) && $data['role'] !== 'admin', 422, 'You cannot remove your own admin access.');
            $user->role = $data['role'];
            $roleChanged = true;
        }

        if (isset($data['is_active']) && $user->is_active !== (bool)$data['is_active']) {
            abort_if($request->user()->is($user) && !$data['is_active'], 422, 'You cannot deactivate your own account.');
            $user->is_active = (bool)$data['is_active'];
            $activeChanged = true;
        }

        if ($user->isDirty()) {
            $user->save();

            if ($roleChanged) {
                ActivityLogger::log($request, 'user.role_updated', "Changed {$user->name}'s role to {$user->role}.", $user);
            }

            if ($activeChanged) {
                $action = $user->is_active ? 'user.activated' : 'user.deactivated';
                $status = $user->is_active ? 'activated' : 'deactivated';
                ActivityLogger::log($request, $action, "User {$user->name} was {$status}.", $user);
            }
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User updated successfully.']);

        return back();
    }
}
