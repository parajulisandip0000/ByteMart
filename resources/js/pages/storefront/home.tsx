import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Clock3,
    RotateCcw,
    ShieldCheck,
    Truck,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useRef, useEffect } from 'react';

import { SectionHeading } from '@/components/home/section-heading';
import { StorefrontFooter } from '@/components/layout/storefront-footer';
import { StorefrontHeader } from '@/components/layout/storefront-header';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import type { Category, Product } from '@/types';

interface HomeProps {
    categories: Category[];
    featuredProducts: Product[];
    saleProducts: Product[];
    topRatedProducts: Product[];
    mostPurchasedProducts: Product[];
}

const benefits = [
    {
        title: 'Fast delivery',
        text: 'Reliable delivery across Nepal',
        icon: Truck,
    },
    {
        title: 'Secure shopping',
        text: 'Protected checkout experience',
        icon: ShieldCheck,
    },
    {
        title: 'Easy returns',
        text: 'Simple 7-day return support',
        icon: RotateCcw,
    },
    {
        title: 'Quality checked',
        text: 'Products selected with care',
        icon: BadgeCheck,
    },
];

export default function Home({
    categories,
    featuredProducts,
    saleProducts,
    topRatedProducts,
    mostPurchasedProducts,
}: HomeProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    // Auto-play category slider when there are more than 6 categories
    useEffect(() => {
        if (categories.length <= 6) return;

        const interval = setInterval(() => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
                }
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [categories.length]);

    return (
        <>
            <Head title="Everyday shopping made simple" />
            <StorefrontHeader />
            <main className="bg-slate-50">
                <section className="bg-gradient-to-br from-brand-sky via-white to-blue-50">
                    <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-16 lg:px-8 lg:py-20">
                        <div>
                            <p className="inline-flex rounded-full bg-brand-yellow px-4 py-1.5 text-xs font-black tracking-wider text-brand-blue uppercase">
                                Season specials
                            </p>
                            <h1 className="mt-5 text-4xl leading-tight font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                                Everything you need,{' '}
                                <span className="text-brand-blue">
                                    all in one place.
                                </span>
                            </h1>
                            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                                Discover quality everyday essentials, trending
                                finds and great deals delivered across Nepal.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Button
                                    size="lg"
                                    className="rounded-full bg-brand-orange px-7 font-bold"
                                    asChild
                                >
                                    <Link href="/shop">
                                        Shop collection <ArrowRight />
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="rounded-full border-brand-blue px-7 font-bold text-brand-blue"
                                    asChild
                                >
                                    <Link href="/deals">Explore deals</Link>
                                </Button>
                            </div>
                            <div className="mt-8 flex gap-7 text-sm">
                                <div>
                                    <strong className="block text-xl text-brand-blue">
                                        10k+
                                    </strong>
                                    <span className="text-slate-500">
                                        Happy shoppers
                                    </span>
                                </div>
                                <div>
                                    <strong className="block text-xl text-brand-blue">
                                        500+
                                    </strong>
                                    <span className="text-slate-500">
                                        Quality products
                                    </span>
                                </div>
                                <div>
                                    <strong className="block text-xl text-brand-blue">
                                        24/7
                                    </strong>
                                    <span className="text-slate-500">
                                        Customer care
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="relative mx-auto w-full max-w-xl">
                            <div className="absolute -top-5 -right-3 size-24 rounded-full bg-brand-yellow/80 blur-sm" />
                            <div className="absolute -bottom-5 -left-3 size-32 rounded-full bg-brand-cyan/20" />
                            <img
                                className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-2xl"
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1100&q=88"
                                alt="A bright modern retail store"
                            />
                            <div className="absolute right-4 bottom-4 rounded-2xl bg-white/95 p-4 shadow-xl">
                                <p className="text-xs font-bold text-brand-orange">
                                    THIS WEEK ONLY
                                </p>
                                <p className="mt-1 text-xl font-black text-brand-blue">
                                    Up to 35% off
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                    <SectionHeading
                        eyebrow="Browse by category"
                        title="Find your favorites"
                        description="From everyday essentials to the latest must-haves."
                    />
                    {categories.length <= 6 ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/categories/${category.slug}`}
                                    className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    {category.imageUrl && (
                                        <div className="aspect-square w-full overflow-hidden bg-slate-100">
                                            <img
                                                src={category.imageUrl}
                                                alt={category.name}
                                                className="size-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <p className="p-3 text-center text-sm font-bold text-slate-800 transition group-hover:text-brand-blue">
                                        {category.name}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="relative group">
                            {/* Scroll buttons */}
                            <button
                                onClick={scrollLeft}
                                className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 shadow-md transition duration-300 hover:bg-brand-blue hover:text-white hover:border-brand-blue active:scale-95 cursor-pointer hidden md:flex"
                                aria-label="Previous categories"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                            
                            <div
                                ref={scrollContainerRef}
                                className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                            >
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/categories/${category.slug}`}
                                        className="group relative min-w-[140px] sm:min-w-[180px] snap-start overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg flex-shrink-0"
                                    >
                                        {category.imageUrl && (
                                            <div className="aspect-square w-full overflow-hidden bg-slate-100">
                                                <img
                                                    src={category.imageUrl}
                                                    alt={category.name}
                                                    className="size-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                        )}
                                        <div className="p-3 text-center">
                                            <p className="text-sm font-bold text-slate-800 transition group-hover:text-brand-blue">
                                                {category.name}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <button
                                onClick={scrollRight}
                                className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 shadow-md transition duration-300 hover:bg-brand-blue hover:text-white hover:border-brand-blue active:scale-95 cursor-pointer hidden md:flex"
                                aria-label="Next categories"
                            >
                                <ChevronRight className="size-5" />
                            </button>
                        </div>
                    )}
                </section>

                {/* Featured Products */}
                <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between gap-3">
                        <SectionHeading
                            eyebrow="Curated for you"
                            title="Featured products"
                            description="Popular choices picked for quality, value and everyday usefulness."
                        />
                        <Button
                            variant="ghost"
                            className="mb-7 hidden font-bold text-brand-blue sm:flex"
                            asChild
                        >
                            <Link href="/shop">
                                View all <ArrowRight />
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-6">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* Deals of the Day (Sales Products) */}
                {saleProducts.length > 0 && (
                    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                        <div className="flex items-end justify-between gap-3">
                            <SectionHeading
                                eyebrow="Limited-time offers"
                                title="Deals of the Day"
                                description="Grab them before they are gone! Quality products at unbeatable prices."
                            />
                            <Button
                                variant="ghost"
                                className="mb-7 hidden font-bold text-brand-blue sm:flex"
                                asChild
                            >
                                <Link href="/deals">
                                    View all deals <ArrowRight />
                                </Link>
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-6">
                            {saleProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Top Rated Favorites */}
                {topRatedProducts.length > 0 && (
                    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                        <div className="flex items-end justify-between gap-3">
                            <SectionHeading
                                eyebrow="Highly recommended"
                                title="Top Rated Favorites"
                                description="Customer favorites based on stellar ratings and verified reviews."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-6">
                            {topRatedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Trending Now (Most Purchased Products) */}
                {mostPurchasedProducts.length > 0 && (
                    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                        <div className="flex items-end justify-between gap-3">
                            <SectionHeading
                                eyebrow="Popular choices"
                                title="Trending Now"
                                description="Our most frequently purchased products this week."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-6">
                            {mostPurchasedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                )}

                <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-[2rem] bg-brand-blue text-white">
                        <div className="grid items-center gap-6 px-6 py-9 sm:px-10 md:grid-cols-[1fr_auto]">
                            <div>
                                <p className="flex items-center gap-2 text-xs font-black tracking-[0.2em] text-brand-yellow uppercase">
                                    <Clock3 className="size-4" /> Limited-time
                                    offer
                                </p>
                                <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                                    Upgrade your everyday. Save up to 35%.
                                </h2>
                                <p className="mt-2 max-w-2xl text-blue-100">
                                    Hand-picked deals on tech, home, fashion and
                                    more. Fresh offers arrive every weekend.
                                </p>
                            </div>
                            <Button
                                size="lg"
                                className="rounded-full bg-brand-yellow px-7 font-bold text-brand-blue hover:bg-yellow-300"
                                asChild
                            >
                                <Link href="/deals">
                                    Discover deals <ArrowRight />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="border-y border-slate-200 bg-white">
                    <div className="mx-auto grid max-w-7xl gap-7 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
                        {benefits.map(({ title, text, icon: Icon }) => (
                            <div
                                className="flex items-center gap-4"
                                key={title}
                            >
                                <span className="rounded-2xl bg-brand-sky/60 p-3 text-brand-blue">
                                    <Icon />
                                </span>
                                <div>
                                    <p className="font-bold text-slate-900">
                                        {title}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
                    <p className="text-xs font-black tracking-[0.2em] text-brand-orange uppercase">
                        Stay in the loop
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                        Get offers worth opening.
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-slate-500">
                        New arrivals, weekend deals and practical shopping
                        inspiration delivered occasionally.
                    </p>
                    <form
                        className="mx-auto mt-6 flex max-w-xl flex-col gap-2 sm:flex-row"
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <input
                            type="email"
                            required
                            className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-brand-cyan focus:ring-3 focus:ring-brand-sky/60"
                            placeholder="Enter your email address"
                            aria-label="Email address"
                        />
                        <Button className="rounded-full bg-brand-orange px-7 py-3 font-bold">
                            Subscribe
                        </Button>
                    </form>
                </section>
            </main>
            <StorefrontFooter />
        </>
    );
}
