import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { AccessibilityPanel } from "@/components/a11y/AccessibilityPanel";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Pemerintah Daerah',
    default: 'Pemerintah Daerah - Transparan, Akuntabel, Melayani',
  },
  description: 'Website Resmi Pemerintah Daerah. Media informasi dan pelayanan publik terintegrasi untuk mewujudkan tata kelola pemerintahan yang bersih dan inovatif.',
  keywords: ['pemerintah daerah', 'layanan publik', 'transparansi', 'akuntabilitas', 'renstra', 'dpa', 'berita pemerintahan'],
  authors: [{ name: 'Diskominfo Pemerintah Daerah' }],
  creator: 'Pemerintah Daerah',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://pemda.go.id',
    title: 'Pemerintah Daerah - Transparan, Akuntabel, Melayani',
    description: 'Portal resmi pelayanan dan informasi Pemerintah Daerah.',
    siteName: 'Website Pemerintah Daerah',
  },
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <ClientLayout>
            {children}
          </ClientLayout>

          <AccessibilityPanel />
          <WhatsAppButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
