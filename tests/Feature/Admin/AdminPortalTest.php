<?php

namespace Tests\Feature\Admin;

use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminPortalTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('admin.dashboard'))->assertRedirect(route('admin.login'));
    }

    public function test_customers_cannot_access_admin_portal(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('admin.dashboard'))
            ->assertForbidden();
    }

    public function test_admin_can_view_dashboard(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/dashboard')
                ->has('metrics'));
    }

    public function test_admin_can_view_customer_logs(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->get(route('admin.customer-logs.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/customer-logs/index')
                ->has('logs'));
    }

    public function test_admin_can_create_product_with_uploaded_image(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();
        $category = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->post(route('admin.products.store'), [
                'name' => 'Desk Speaker',
                'slug' => 'desk-speaker',
                'category_ids' => [$category->id],
                'short_description' => 'Compact audio for a work desk.',
                'description' => 'A compact powered speaker designed for everyday listening.',
                'sku' => 'BM-SPEAKER-01',
                'price' => '2499',
                'compare_at_price' => '2999',
                'stock_quantity' => 12,
                'is_active' => true,
                'is_featured' => true,
                'image' => UploadedFile::fake()->createWithContent(
                    'speaker.png',
                    base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=')
                ),
            ])
            ->assertRedirect(route('admin.products.index'));

        $product = Product::where('slug', 'desk-speaker')->firstOrFail();

        $this->assertDatabaseHas('product_variants', [
            'product_id' => $product->id,
            'sku' => 'BM-SPEAKER-01',
        ]);
        $this->assertTrue($product->categories()->whereKey($category->id)->exists());
        $this->assertDatabaseHas('activity_logs', [
            'action' => 'product.created',
            'subject_id' => $product->id,
        ]);
        Storage::disk('public')->assertExists(
            str($product->images()->firstOrFail()->url)->after('/storage/')->toString()
        );
    }

    public function test_admin_can_create_category_and_activity_is_logged(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post(route('admin.categories.store'), [
                'name' => 'Office',
                'slug' => 'office',
                'sort_order' => 3,
                'is_active' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('categories', ['slug' => 'office']);
        $this->assertDatabaseHas('activity_logs', ['action' => 'category.created']);
    }

    public function test_admin_can_promote_customer(): void
    {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create();

        $this->actingAs($admin)
            ->patch(route('admin.users.update', $customer), ['role' => 'admin'])
            ->assertRedirect();

        $this->assertSame('admin', $customer->fresh()->role);
        $this->assertTrue(ActivityLog::where('action', 'user.role_updated')->exists());
    }
}
