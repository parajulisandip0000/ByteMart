import { Link, router } from '@inertiajs/react';
import { Grid2X2, LoaderCircle, Package, Search, Tags } from 'lucide-react';
import { useEffect, useId, useMemo, useState } from 'react';
import type { FormEvent, KeyboardEvent, ReactNode } from 'react';

interface Suggestion {
    name: string;
    slug: string;
    imageUrl?: string | null;
}

interface Suggestions {
    products: Suggestion[];
    categories: Suggestion[];
    brands: Suggestion[];
}

interface SuggestionLink extends Suggestion {
    href: string;
}

const emptySuggestions: Suggestions = {
    products: [],
    categories: [],
    brands: [],
};

export function StorefrontSearch({
    className = 'hidden md:block',
}: {
    className?: string;
}) {
    const suggestionsId = useId();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState(emptySuggestions);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const suggestionLinks = useMemo<SuggestionLink[]>(
        () => [
            ...suggestions.products.map((suggestion) => ({
                ...suggestion,
                href: `/products/${suggestion.slug}`,
            })),
            ...suggestions.categories.map((suggestion) => ({
                ...suggestion,
                href: `/categories/${suggestion.slug}`,
            })),
            ...suggestions.brands.map((suggestion) => ({
                ...suggestion,
                href: `/shop?brand=${suggestion.slug}`,
            })),
        ],
        [suggestions],
    );

    useEffect(() => {
        const search = query.trim();

        if (search.length < 2) {
            return;
        }

        const controller = new AbortController();
        const timeout = window.setTimeout(async () => {
            setLoading(true);

            try {
                const response = await fetch(
                    `/search/suggestions?q=${encodeURIComponent(search)}`,
                    {
                        headers: { Accept: 'application/json' },
                        signal: controller.signal,
                    },
                );

                if (!response.ok) {
                    throw new Error('Unable to load search suggestions.');
                }

                setSuggestions((await response.json()) as Suggestions);
                setActiveIndex(-1);
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === 'AbortError'
                ) {
                    return;
                }

                setSuggestions(emptySuggestions);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }, 250);

        return () => {
            window.clearTimeout(timeout);
            controller.abort();
        };
    }, [query]);

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const search = query.trim();

        if (search !== '') {
            router.get('/shop', { q: search });
            setOpen(false);
        }
    };

    const selectSuggestion = (index: number) => {
        const suggestion = suggestionLinks[index];

        if (suggestion) {
            router.visit(suggestion.href);
            setOpen(false);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            setOpen(false);

            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) =>
                Math.min(index + 1, suggestionLinks.length - 1),
            );

            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, -1));

            return;
        }

        if (event.key === 'Enter' && activeIndex >= 0) {
            event.preventDefault();
            selectSuggestion(activeIndex);
        }
    };

    const hasSuggestions = suggestionLinks.length > 0;
    const showDropdown = open && query.trim().length >= 2;
    let itemIndex = -1;

    return (
        <form
            action="/shop"
            className={`relative mx-auto max-w-2xl flex-1 ${className}`}
            onSubmit={submitSearch}
        >
            <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
            <input
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pr-5 pl-12 text-sm transition outline-none focus:border-brand-cyan focus:ring-3 focus:ring-brand-sky/60"
                placeholder="Search products, categories and brands"
                aria-label="Search products, categories and brands"
                aria-expanded={showDropdown}
                aria-controls={suggestionsId}
                autoComplete="off"
                name="q"
                value={query}
                onChange={(event) => {
                    const search = event.target.value;

                    setQuery(search);
                    setOpen(true);
                    setActiveIndex(-1);
                    setSuggestions(emptySuggestions);
                    setLoading(search.trim().length >= 2);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
                onBlur={() => window.setTimeout(() => setOpen(false), 150)}
            />
            {showDropdown && (
                <div
                    id={suggestionsId}
                    className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                >
                    {loading ? (
                        <p className="flex items-center justify-center gap-2 px-4 py-6 text-sm font-bold text-brand-blue">
                            <LoaderCircle className="size-4 animate-spin" />
                            Searching catalog
                        </p>
                    ) : hasSuggestions ? (
                        <>
                            <SuggestionGroup
                                title="Products"
                                icon={<Package className="size-4" />}
                                suggestions={suggestions.products.map(
                                    (suggestion) => ({
                                        ...suggestion,
                                        href: `/products/${suggestion.slug}`,
                                    }),
                                )}
                                activeIndex={activeIndex}
                                nextIndex={() => ++itemIndex}
                                onSelect={() => setOpen(false)}
                            />
                            <SuggestionGroup
                                title="Categories"
                                icon={<Grid2X2 className="size-4" />}
                                suggestions={suggestions.categories.map(
                                    (suggestion) => ({
                                        ...suggestion,
                                        href: `/categories/${suggestion.slug}`,
                                    }),
                                )}
                                activeIndex={activeIndex}
                                nextIndex={() => ++itemIndex}
                                onSelect={() => setOpen(false)}
                            />
                            <SuggestionGroup
                                title="Brands"
                                icon={<Tags className="size-4" />}
                                suggestions={suggestions.brands.map(
                                    (suggestion) => ({
                                        ...suggestion,
                                        href: `/shop?brand=${suggestion.slug}`,
                                    }),
                                )}
                                activeIndex={activeIndex}
                                nextIndex={() => ++itemIndex}
                                onSelect={() => setOpen(false)}
                            />
                        </>
                    ) : (
                        <p className="px-4 py-6 text-center text-sm text-slate-500">
                            No matching products, categories or brands found.
                        </p>
                    )}
                </div>
            )}
        </form>
    );
}

function SuggestionGroup({
    title,
    icon,
    suggestions,
    activeIndex,
    nextIndex,
    onSelect,
}: {
    title: string;
    icon: ReactNode;
    suggestions: SuggestionLink[];
    activeIndex: number;
    nextIndex: () => number;
    onSelect: () => void;
}) {
    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className="border-b border-slate-100 py-2 last:border-0">
            <p className="flex items-center gap-2 px-4 py-1 text-xs font-black tracking-wider text-brand-blue uppercase">
                {icon}
                {title}
            </p>
            {suggestions.map((suggestion) => {
                const index = nextIndex();

                return (
                    <Link
                        key={suggestion.href}
                        href={suggestion.href}
                        onClick={onSelect}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-brand-sky/30 hover:text-brand-blue ${
                            index === activeIndex
                                ? 'bg-brand-sky/30 text-brand-blue'
                                : ''
                        }`}
                    >
                        {suggestion.imageUrl ? (
                            <img
                                src={suggestion.imageUrl}
                                alt=""
                                className="size-9 rounded-lg object-cover"
                            />
                        ) : (
                            <span className="grid size-9 place-items-center rounded-lg bg-brand-sky/40 text-brand-blue">
                                {icon}
                            </span>
                        )}
                        {suggestion.name}
                    </Link>
                );
            })}
        </div>
    );
}
