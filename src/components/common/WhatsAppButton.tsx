"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const phoneNumber = "6285384569300";
    const message = "Halo, saya ingin bertanya seputar layanan Pemerintah Daerah.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform hover:scale-110 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                }`}
            aria-label="Hubungi kami via WhatsApp"
        >
            <div className="relative group">
                {/* Pulse Effect */}
                <div className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping group-hover:bg-[#25D366]/50 duration-1000"></div>

                {/* Main Button */}
                <div className="relative w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#20bd5a] rounded-full shadow-xl flex items-center justify-center transition-colors duration-300 border-2 border-white/20">
                    <FaWhatsapp className="w-8 h-8 md:w-10 md:h-10 text-white fill-current" />
                </div>
            </div>
        </Link>
    );
}
