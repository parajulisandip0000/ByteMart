<?php

namespace Tests\Feature\Storefront;

use Database\Seeders\CatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HomePageTest extends TestCase
{
    use RefreshDatabase;

    public function test_landing_page_returns_seeded_categories_and_featured_products(): void
    {
        $this->seed(CatalogSeeder::class);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('storefront/home')
                ->has('categories', 6)
                ->where('categories.0.name', 'Electronics')
                ->has('featuredProducts', 6)
                ->where('featuredProducts.0.name', 'Pulse Wireless Headphones')
                ->where('featuredProducts.0.price', '3499.00')
                ->where('featuredProducts.0.compareAtPrice', '4499.00')
                ->where('featuredProducts.0.inStock', true)
            );
    }
}
