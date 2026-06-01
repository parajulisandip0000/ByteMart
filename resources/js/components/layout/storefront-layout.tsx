import type { PropsWithChildren } from 'react';

import { StorefrontFooter } from '@/components/layout/storefront-footer';
import { StorefrontHeader } from '@/components/layout/storefront-header';

export function StorefrontLayout({ children }: PropsWithChildren) {
    return (
        <>
            <StorefrontHeader />
            <main className="min-h-[60vh] bg-slate-50">{children}</main>
            <StorefrontFooter />
        </>
    );
}
