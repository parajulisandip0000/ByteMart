import { Link, usePage } from '@inertiajs/react';
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { useState } from 'react';

import { StorefrontSearch } from '@/components/layout/storefront-search';
import { Button } from '@/components/ui/button';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Categories', href: '/categories' },
    { label: 'About us', href: '/about' },
];

const announcements = [
    'Free delivery inside Kathmandu Valley on orders over Rs. 2,500',
    'Weekend deals available on selected ByteMart favorites',
    'Secure shopping with reliable delivery across Nepal',
    'New arrivals added regularly across every category',
    'Contact info@bytesphere.com.np for customer support',
];

export function StorefrontHeader() {
    const { url } = usePage();
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const isActive = (href: string) =>
        href === '/' ? url === '/' : url.startsWith(href);

    return (
        <>
            <div
                className="group overflow-hidden bg-brand-blue py-2 text-xs font-medium text-white sm:text-sm"
                aria-label="Store announcements"
            >
                <p className="sr-only">{announcements.join('. ')}</p>
                <div className="announcement-track" aria-hidden="true">
                    {[0, 1].map((group) => (
                        <div key={group} className="flex shrink-0 items-center">
                            {announcements.map((announcement) => (
                                <span
                                    key={`${group}-${announcement}`}
                                    className="flex shrink-0 items-center px-4 sm:px-6"
                                >
                                    <span className="mr-3 size-1.5 rounded-full bg-brand-yellow sm:mr-4" />
                                    {announcement}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        aria-label="Open navigation"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? <X /> : <Menu />}
                    </Button>
                    <Link
                        href="/"
                        className="shrink-0 text-2xl font-black tracking-tight text-brand-blue"
                    >
                        Byte<span className="text-brand-orange">Mart</span>
                    </Link>
                    <StorefrontSearch />
                    <div className="ml-auto flex items-center gap-1 sm:gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Search"
                            className="md:hidden"
                            onClick={() => setMobileSearchOpen((open) => !open)}
                        >
                            <Search />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Wishlist"
                        >
                            <Heart />
                        </Button>
                        <Link href="/login">
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Account"
                            >
                                <UserRound />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Cart"
                            className="relative"
                        >
                            <ShoppingBag />
                            <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
                                0
                            </span>
                        </Button>
                    </div>
                </div>
                {mobileSearchOpen && (
                    <div className="px-4 pb-4 md:hidden">
                        <StorefrontSearch className="block" />
                    </div>
                )}
                <nav className="hidden border-t border-slate-100 lg:block">
                    <div className="mx-auto flex max-w-7xl items-center gap-8 px-8 py-3 text-sm font-semibold text-slate-700">
                        {navItems.map((item) => (
                            <Link
                                href={item.href}
                                className={
                                    isActive(item.href)
                                        ? 'text-brand-blue'
                                        : 'transition hover:text-brand-blue'
                                }
                                key={item.href}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href="/deals"
                            className="ml-auto font-bold text-brand-orange"
                        >
                            Weekend Deals
                        </Link>
                    </div>
                </nav>
                {menuOpen && (
                    <nav className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
                        <div className="grid gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={`rounded-lg px-3 py-2 text-sm font-semibold ${isActive(item.href) ? 'bg-brand-sky/50 text-brand-blue' : 'text-slate-700 hover:bg-slate-50'}`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </nav>
                )}
            </header>
        </>
    );
}
