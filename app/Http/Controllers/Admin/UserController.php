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

        return Inertia::render('admin/users/index', [
            'users' => User::when($search, fn ($query) => $query
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%"))
                ->latest()
                ->paginate(15)
                ->withQueryString()
                ->through(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'verifiedAt' => $user->email_verified_at?->toDateTimeString(),
                    'createdAt' => $user->created_at->toDateTimeString(),
                ]),
            'filters' => ['search' => $search],
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate(['role' => ['required', Rule::in(['customer', 'admin'])]]);
        abort_if($request->user()->is($user) && $data['role'] !== 'admin', 422, 'You cannot remove your own admin access.');

        $user->update($data);
        ActivityLogger::log($request, 'user.role_updated', "Changed {$user->name}'s role to {$user->role}.", $user);
        Inertia::flash('toast', ['type' => 'success', 'message' => 'User role updated successfully.']);

        return back();
    }
}
