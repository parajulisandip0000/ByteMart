<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeUserAdmin extends Command
{
    protected $signature = 'user:make-admin {email : The account email address}';

    protected $description = 'Grant admin portal access to an existing user account';

    public function handle(): int
    {
        $user = User::where('email', $this->argument('email'))->first();

        if (! $user) {
            $this->error('No user exists with that email address.');

            return self::FAILURE;
        }

        $user->update(['role' => 'admin']);
        $this->info("{$user->email} can now access /admin.");

        return self::SUCCESS;
    }
}
