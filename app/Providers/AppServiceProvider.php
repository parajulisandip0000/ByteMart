<?php

namespace App\Providers;

use App\Support\ActivityLogger;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureActivityLogging();
    }

    protected function configureActivityLogging(): void
    {
        Event::listen(Login::class, fn (Login $event) => ActivityLogger::log(
            request(),
            'auth.login',
            "Signed in as {$event->user->name}.",
            $event->user,
            actor: $event->user,
        ));

        Event::listen(Logout::class, fn (Logout $event) => ActivityLogger::log(
            request(),
            'auth.logout',
            "Signed out {$event->user->name}.",
            $event->user,
            actor: $event->user,
        ));
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
