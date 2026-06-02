<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StaffAccountCreated extends Notification
{
    use Queueable;

    protected string $token;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->email,
        ]);

        return (new MailMessage)
            ->subject('Welcome to ' . config('app.name') . ' - Setup Your Password')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('An administrator has created a staff account for you on ' . config('app.name') . '.')
            ->line('Your account details:')
            ->line('Email: ' . $notifiable->email)
            ->line('Role: ' . ucfirst($notifiable->role))
            ->line('Before you can log in, you need to set up a password for your account.')
            ->action('Set Up Password', $url)
            ->line('If you did not expect this account to be created, no further action is required.');
    }
}
