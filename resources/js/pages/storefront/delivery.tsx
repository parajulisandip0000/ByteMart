import { ContentBlock, ContentPage } from '@/components/layout/content-page';

export default function Delivery() {
    return (
        <ContentPage
            eyebrow="Delivery information"
            title="Reliable delivery across Nepal."
            description="We work to deliver every ByteMart order carefully and keep the process clear from checkout to arrival."
        >
            <ContentBlock title="Delivery areas">
                <p>
                    Orders can be delivered inside Kathmandu Valley and to
                    supported locations across Nepal. Available delivery options
                    and charges will be shown during checkout.
                </p>
            </ContentBlock>
            <ContentBlock title="Delivery timing">
                <p>
                    Delivery timing depends on your location and product
                    availability. Our team will confirm your order details and
                    provide an estimated delivery window.
                </p>
            </ContentBlock>
            <ContentBlock title="Order support">
                <p>
                    For help with an order, email{' '}
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
