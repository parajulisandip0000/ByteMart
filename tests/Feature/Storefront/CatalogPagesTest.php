<?php

namespace Tests\Feature\Storefront;

use App\Models\Product;
use App\Models\ProductVariant;
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
                ->has('products.data', 4)
                ->has('categories', 6)
                ->has('topRatedProducts', 4)
                ->where('topRatedProducts.0.slug', 'pulse-wireless-headphones')
            );
    }

    public function test_shop_second_page_returns_the_next_product_batch(): void
    {
        $this->get(route('shop.index', ['page' => 2]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('products.current_page', 2)
                ->has('products.data', 4)
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

    public function test_shop_search_matches_category_and_brand_names(): void
    {
        $this->get(route('shop.index', ['q' => 'Electronics']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('products.total', 2));

        $this->get(route('shop.index', ['brand' => 'nova-tech']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.brand', 'nova-tech')
                ->where('products.total', 1)
                ->where('products.data.0.slug', 'nova-smart-watch')
            );
    }

    public function test_search_suggestions_return_products_categories_and_brands(): void
    {
        $this->getJson(route('search.suggestions', ['q' => 'Nova']))
            ->assertOk()
            ->assertJsonPath('products.0.slug', 'nova-smart-watch')
            ->assertJsonPath('brands.0.slug', 'nova-tech');

        $this->getJson(route('search.suggestions', ['q' => 'Electronics']))
            ->assertOk()
            ->assertJsonPath('categories.0.slug', 'electronics');
    }

    public function test_search_suggestions_require_at_least_two_characters(): void
    {
        $this->getJson(route('search.suggestions', ['q' => 'N']))
            ->assertOk()
            ->assertExactJson([
                'products' => [],
                'categories' => [],
                'brands' => [],
            ]);
    }

    public function test_shop_price_range_filters_products(): void
    {
        $this->get(route('shop.index', ['max_price' => 2000]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.minPrice', 1299)
                ->where('filters.maxPrice', 2000)
                ->where('filterOptions.maxPrice', 5899)
                ->where('products.total', 4)
            );
    }

    public function test_shop_stock_filter_excludes_out_of_stock_products(): void
    {
        ProductVariant::query()->where('sku', 'ELEC-HEAD-001')->update(['stock_quantity' => 0]);

        $this->get(route('shop.index', ['in_stock' => 1]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.inStock', true)
                ->where('products.total', 7)
            );
    }

    public function test_shop_sale_filter_only_lists_discounted_products(): void
    {
        $this->get(route('shop.index', ['on_sale' => 1]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.onSale', true)
                ->where('products.total', 7)
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
                ->where('product.brand', 'Pulse Audio')
                ->where('product.brandSlug', 'pulse-audio')
                ->where('product.category', 'Electronics')
                ->where('product.shortDescription', 'A dependable ByteMart pick made for comfortable everyday use.')
                ->where('product.rating.average', 5)
                ->where('product.rating.count', 1)
                ->has('product.reviews', 1)
                ->where('product.variant.sku', 'ELEC-HEAD-001')
                ->where('product.variant.price', '3499.00')
            );
    }

    public function test_customer_can_submit_a_product_review(): void
    {
        $product = Product::query()->where('slug', 'pulse-wireless-headphones')->firstOrFail();

        $this->post(route('products.reviews.store', $product), [
            'name' => 'Sandip Parajuli',
            'email' => 'sandip@example.com',
            'rating' => 4,
            'comment' => 'The headphones sound clear and arrived in good condition.',
        ])->assertRedirect(route('products.show', $product));

        $this->assertDatabaseHas('product_reviews', [
            'product_id' => $product->id,
            'name' => 'Sandip Parajuli',
            'email' => 'sandip@example.com',
            'rating' => 4,
        ]);

        $this->get(route('products.show', $product))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('product.rating.average', 4.5)
                ->where('product.rating.count', 2)
                ->where('product.reviews.0.name', 'Sandip Parajuli')
                ->missing('product.reviews.0.email')
            );
    }

    public function test_product_review_submission_is_validated(): void
    {
        $product = Product::query()->where('slug', 'pulse-wireless-headphones')->firstOrFail();

        $this->post(route('products.reviews.store', $product), [
            'name' => '',
            'email' => 'invalid-email',
            'rating' => 6,
            'comment' => 'short',
        ])->assertSessionHasErrors(['name', 'email', 'rating', 'comment']);
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

    public function test_cart_wishlist_and_checkout_pages_are_available(): void
    {
        $this->get(route('cart.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('storefront/cart'));

        $this->get(route('wishlist.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('storefront/wishlist'));

        $this->get(route('checkout.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('storefront/checkout'));
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
