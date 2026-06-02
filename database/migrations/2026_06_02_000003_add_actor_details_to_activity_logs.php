<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->string('actor_type')->default('admin')->after('user_id');
            $table->string('actor_name')->nullable()->after('actor_type');
            $table->string('actor_email')->nullable()->after('actor_name');
            $table->index(['actor_type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropIndex(['actor_type', 'created_at']);
            $table->dropColumn(['actor_type', 'actor_name', 'actor_email']);
        });
    }
};
