import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export function StorefrontFooter() {
    return (
        <footer className="bg-brand-blue text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
                <div>
                    <p className="text-2xl font-black">
                        Byte<span className="text-brand-yellow">Mart</span>
                    </p>
                    <p className="mt-3 text-sm leading-6 text-blue-100">
                        Your everyday marketplace for quality essentials at
                        honest prices.
                    </p>
                </div>
                <div>
                    <p className="font-bold">Quick links</p>
                    <div className="mt-3 grid gap-2 text-sm text-blue-100">
                        <span>Shop products</span>
                        <span>About ByteMart</span>
                        <span>Delivery information</span>
                        <span>Returns & support</span>
                    </div>
                </div>
                <div>
                    <p className="font-bold">Contact</p>
                    <div className="mt-3 grid gap-3 text-sm text-blue-100">
                        <span className="flex gap-2">
                            <MapPin className="size-4 shrink-0" /> Kathmandu,
                            Nepal
                        </span>
                        <span className="flex gap-2">
                            <Phone className="size-4 shrink-0" /> +977
                            01-5555555
                        </span>
                        <span className="flex gap-2">
                            <Mail className="size-4 shrink-0" />{' '}
                            info@bytesphere.com.np
                        </span>
                    </div>
                </div>
                <div>
                    <p className="font-bold">Follow us</p>
                    <div className="mt-3 flex gap-3">
                        <span className="rounded-full bg-white/10 p-2">
                            <Facebook className="size-5" />
                        </span>
                        <span className="rounded-full bg-white/10 p-2">
                            <Instagram className="size-5" />
                        </span>
                    </div>
                </div>
            </div>
            <div className="border-t border-white/15 px-4 py-4 text-center text-xs text-blue-100">
                &copy; 2026 ByteMart. All rights reserved.
            </div>
        </footer>
    );
}
