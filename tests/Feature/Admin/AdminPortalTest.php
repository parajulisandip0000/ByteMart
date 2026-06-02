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
                ->has('metrics')
                ->has('analytics'));
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

    public function test_manager_can_access_admin_portal(): void
    {
        $manager = User::factory()->create(['role' => 'manager']);

        $this->actingAs($manager)
            ->get(route('admin.dashboard'))
            ->assertOk();
    }

    public function test_inactive_user_cannot_login(): void
    {
        $user = User::factory()->create(['is_active' => false]);

        $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
        ])->assertSessionHasErrors();

        $admin = User::factory()->admin()->create(['is_active' => false]);

        $this->post(route('admin.login.store'), [
            'email' => $admin->email,
            'password' => 'password',
        ])->assertSessionHasErrors();
    }

    public function test_inactive_user_is_logged_out_on_next_request(): void
    {
        $admin = User::factory()->admin()->create();
        $this->actingAs($admin)
            ->get(route('admin.dashboard'))
            ->assertOk();

        $admin->update(['is_active' => false]);

        $this->actingAs($admin)
            ->get(route('admin.dashboard'))
            ->assertRedirect(route('admin.login'))
            ->assertSessionHasErrors('email');

        $customer = User::factory()->create();
        $this->actingAs($customer)
            ->get(route('dashboard'))
            ->assertOk();

        $customer->update(['is_active' => false]);

        $this->actingAs($customer)
            ->get(route('dashboard'))
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors('email');
    }

    public function test_admin_cannot_deactivate_self(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->patch(route('admin.users.update', $admin), ['is_active' => false])
            ->assertStatus(422);

        $this->assertTrue($admin->fresh()->is_active);
    }

    public function test_admin_cannot_demote_self(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->patch(route('admin.users.update', $admin), ['role' => 'customer'])
            ->assertStatus(422);

        $this->assertSame('admin', $admin->fresh()->role);
    }

    public function test_admin_can_create_staff_user(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post(route('admin.users.store'), [
                'name' => 'John Manager',
                'email' => 'john@bytemart.com',
                'password' => 'password123',
                'role' => 'manager',
                'permissions' => ['products', 'orders'],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'email' => 'john@bytemart.com',
            'role' => 'manager',
        ]);

        $manager = User::where('email', 'john@bytemart.com')->firstOrFail();
        $this->assertTrue($manager->hasPermission('products'));
        $this->assertTrue($manager->hasPermission('orders'));
        $this->assertFalse($manager->hasPermission('categories'));
    }

    public function test_admin_can_create_staff_user_without_password(): void
    {
        \Illuminate\Support\Facades\Notification::fake();

        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post(route('admin.users.store'), [
                'name' => 'Jane Manager',
                'email' => 'jane@bytemart.com',
                'role' => 'manager',
                'permissions' => ['products'],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'email' => 'jane@bytemart.com',
            'role' => 'manager',
        ]);

        $manager = User::where('email', 'jane@bytemart.com')->firstOrFail();
        $this->assertNotEmpty($manager->password);
        $this->assertTrue($manager->hasPermission('products'));

        \Illuminate\Support\Facades\Notification::assertSentTo(
            $manager,
            \App\Notifications\StaffAccountCreated::class
        );
    }

    public function test_admin_can_update_manager_permissions(): void
    {
        $admin = User::factory()->admin()->create();
        $manager = User::factory()->create([
            'role' => 'manager',
            'permissions' => ['products'],
        ]);

        $this->actingAs($admin)
            ->patch(route('admin.users.update', $manager), [
                'permissions' => ['products', 'categories'],
            ])
            ->assertRedirect();

        $this->assertTrue($manager->fresh()->hasPermission('categories'));
    }

    public function test_manager_with_permission_can_access_route(): void
    {
        $manager = User::factory()->create([
            'role' => 'manager',
            'permissions' => ['products'],
        ]);

        $this->actingAs($manager)
            ->get(route('admin.products.index'))
            ->assertOk();
    }

    public function test_manager_without_permission_cannot_access_route(): void
    {
        $manager = User::factory()->create([
            'role' => 'manager',
            'permissions' => ['products'],
        ]);

        $this->actingAs($manager)
            ->get(route('admin.categories.index'))
            ->assertForbidden();
    }
}
