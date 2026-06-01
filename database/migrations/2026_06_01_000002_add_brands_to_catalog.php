<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('brand_id')->nullable()->after('id')->constrained()->nullOnDelete();
        });

        $now = now();
        $brands = [
            ['name' => 'Pulse Audio', 'slug' => 'pulse-audio'],
            ['name' => 'Nova Tech', 'slug' => 'nova-tech'],
            ['name' => 'StreetStep', 'slug' => 'streetstep'],
            ['name' => 'Nordic Home', 'slug' => 'nordic-home'],
            ['name' => 'Glow Care', 'slug' => 'glow-care'],
            ['name' => 'FlexFit', 'slug' => 'flexfit'],
            ['name' => 'Brew House', 'slug' => 'brew-house'],
            ['name' => 'Green Basket', 'slug' => 'green-basket'],
        ];

        DB::table('brands')->insert(array_map(
            fn (array $brand) => [...$brand, 'created_at' => $now, 'updated_at' => $now],
            $brands,
        ));

        $brandIds = DB::table('brands')->pluck('id', 'slug');
        $productBrands = [
            'pulse-wireless-headphones' => 'pulse-audio',
            'nova-smart-watch' => 'nova-tech',
            'everyday-canvas-sneakers' => 'streetstep',
            'nordic-table-lamp' => 'nordic-home',
            'glow-daily-skincare-set' => 'glow-care',
            'flex-yoga-essentials-kit' => 'flexfit',
            'brew-ceramic-mug-set' => 'brew-house',
            'organic-pantry-basket' => 'green-basket',
        ];

        foreach ($productBrands as $productSlug => $brandSlug) {
            DB::table('products')
                ->where('slug', $productSlug)
                ->update(['brand_id' => $brandIds[$brandSlug]]);
        }
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropConstrainedForeignId('brand_id');
        });

        Schema::dropIfExists('brands');
    }
};
