<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedInteger('wishlist_count')->default(0)->after('is_featured');
            $table->unsignedInteger('cart_count')->default(0)->after('wishlist_count');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['wishlist_count', 'cart_count']);
        });
    }
};
