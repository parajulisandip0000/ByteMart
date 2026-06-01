# ByteMart

ByteMart is a scalable ecommerce storefront built with Laravel, React, TypeScript, Inertia, Tailwind CSS, shadcn/ui, and MariaDB.

## Features

- Responsive ecommerce landing page
- Product categories with filtered listing pages
- Shop page with search and price sorting
- Weekend deals page
- Product detail pages with related products
- About, delivery, and returns pages
- Laravel authentication starter kit
- Seeded sample catalog with variant-ready products
- NPR price formatting

## Requirements

- PHP 8.3 or newer
- Composer
- Node.js and npm
- MariaDB or MySQL

## Local Setup

```bash
git clone https://github.com/parajulisandip0000/ByteMart.git
cd ByteMart
composer install
npm install
copy .env.example .env
php artisan key:generate
```

Create a database named `bytemart`, then configure the database values in `.env`.

```env
DB_CONNECTION=mariadb
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bytemart
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations and seed the sample catalog:

```bash
php artisan migrate --seed
```

Start the application:

```bash
composer run dev
```

Open [http://localhost:8000](http://localhost:8000).

## Storefront Routes

| Page | URL |
| --- | --- |
| Home | `/` |
| Shop | `/shop` |
| Categories | `/categories` |
| Category products | `/categories/{slug}` |
| Weekend deals | `/deals` |
| Product details | `/products/{slug}` |
| About | `/about` |
| Delivery | `/delivery` |
| Returns and support | `/returns` |

## Verification

```bash
php artisan test
npm run format:check
npm run lint:check
npm run types:check
npm run build
vendor/bin/pint --test
```
