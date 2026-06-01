<?php

namespace Tests\Feature\Storefront;

use Database\Seeders\CatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class CatalogPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(CatalogSeeder::class);
    }

    public function test_shop_page_lists_all_products(): void
    {
        $this->get(route('shop.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('storefront/shop')
                ->where('pageTitle', 'Shop all products')
                ->where('products.total', 8)
                ->has('categories', 6)
            );
    }

    public function test_category_page_filters_products(): void
    {
        $this->get(route('categories.show', 'electronics'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('storefront/shop')
                ->where('filters.category', 'electronics')
                ->where('products.total', 2)
            );
    }

    public function test_shop_search_filters_products(): void
    {
        $this->get(route('shop.index', ['q' => 'Sneakers']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.q', 'Sneakers')
                ->where('products.total', 1)
                ->where('products.data.0.slug', 'everyday-canvas-sneakers')
            );
    }

    public function test_deals_page_only_lists_discounted_products(): void
    {
        $this->get(route('deals.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('storefront/shop')
                ->where('dealsOnly', true)
                ->where('products.total', 7)
            );
    }

    public function test_product_page_returns_product_details(): void
    {
        $this->get(route('products.show', 'pulse-wireless-headphones'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('storefront/product')
                ->where('product.name', 'Pulse Wireless Headphones')
                ->where('product.variant.sku', 'ELEC-HEAD-001')
                ->where('product.variant.price', '3499.00')
            );
    }

    public function test_categories_page_returns_all_categories(): void
    {
        $this->get(route('categories.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('storefront/categories')
                ->has('categories', 6)
                ->where('categories.0.slug', 'electronics')
            );
    }

    #[DataProvider('contentPages')]
    public function test_content_pages_are_available(string $routeName, string $component): void
    {
        $this->get(route($routeName))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component($component));
    }

    public static function contentPages(): array
    {
        return [
            ['about', 'storefront/about'],
            ['delivery', 'storefront/delivery'],
            ['returns', 'storefront/returns'],
        ];
    }
}
