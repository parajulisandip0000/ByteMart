<?php

namespace App\Support;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ActivityLogger
{
    /**
     * @param  array<string, mixed>  $metadata
     */
    public static function log(
        Request $request,
        string $action,
        string $description,
        ?Model $subject = null,
        array $metadata = [],
        ?User $actor = null,
        ?string $actorType = null,
        ?string $actorName = null,
        ?string $actorEmail = null,
    ): void {
        $actor ??= $request->user();

        ActivityLog::create([
            'user_id' => $actor?->id,
            'actor_type' => $actorType ?? $actor?->role ?? 'guest',
            'actor_name' => $actorName ?? $actor?->name,
            'actor_email' => $actorEmail ?? $actor?->email,
            'action' => $action,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'description' => $description,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'metadata' => $metadata ?: null,
        ]);
    }
}
