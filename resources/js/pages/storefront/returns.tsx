import { ContentBlock, ContentPage } from '@/components/layout/content-page';

export default function Returns() {
    return (
        <ContentPage
            eyebrow="Returns & support"
            title="Support when you need it."
            description="If an order is not right, contact ByteMart promptly so our team can review the issue and guide you through the next steps."
        >
            <ContentBlock title="Return requests">
                <p>
                    Submit return requests within 7 days of delivery. Products
                    should be unused, complete and returned with their original
                    packaging unless the item arrived damaged or defective.
                </p>
            </ContentBlock>
            <ContentBlock title="Damaged or incorrect items">
                <p>
                    Contact us as soon as possible with your order details and
                    clear photos. Our team will review the request and arrange
                    an appropriate resolution.
                </p>
            </ContentBlock>
            <ContentBlock title="Contact support">
                <p>
                    Email{' '}
                    <a
                        className="font-bold text-brand-blue"
                        href="mailto:info@bytesphere.com.np"
                    >
                        info@bytesphere.com.np
                    </a>{' '}
                    with your order number and a short description of the issue.
                </p>
            </ContentBlock>
        </ContentPage>
    );
}
