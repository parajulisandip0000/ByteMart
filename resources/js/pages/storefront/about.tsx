import { ContentBlock, ContentPage } from '@/components/layout/content-page';

export default function About() {
    return (
        <ContentPage
            eyebrow="About ByteMart"
            title="Shopping made simpler."
            description="ByteMart brings practical products, clear value and dependable service together in one easy shopping experience."
        >
            <ContentBlock title="Our purpose">
                <p>
                    We help customers discover reliable everyday products
                    without unnecessary complexity. Our collection covers
                    technology, fashion, home, beauty, sports and groceries.
                </p>
            </ContentBlock>
            <ContentBlock title="What matters to us">
                <p>
                    We focus on useful products, fair pricing, responsive
                    support and a straightforward delivery experience across
                    Nepal.
                </p>
            </ContentBlock>
            <ContentBlock title="Need help?">
                <p>
                    Contact our team at{' '}
                    <a
                        className="font-bold text-brand-blue"
                        href="mailto:info@bytesphere.com.np"
                    >
                        info@bytesphere.com.np
                    </a>
                    .
                </p>
            </ContentBlock>
        </ContentPage>
    );
}
