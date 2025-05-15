import type { Metadata } from 'next';
import './globals.css';
import { Inter, Poppins, Roboto } from 'next/font/google';
import localFont from 'next/font/local';

// Define local font for Haettenschweiler
const haettenschweiler = localFont({
  src: '../public/assets/fonts/HATTEN.ttf',
  variable: '--font-haettenschweiler',
  display: 'swap',
});

// Define fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Number Leader - Empowering Startups. Enabling Investments!',
  description: 'Number Leader is a comprehensive platform designed to connect startups, investors, and enablers in the ecosystem. We provide AI-powered tools, curated deal flow, and tailored strategies.',
  keywords: 'startup, investor, funding, investment, financial tools, valuation, pitch deck, business plan, deal flow, startup ecosystem',
  authors: [{ name: 'Number Leader' }],
  openGraph: {
    title: 'Number Leader - Empowering Startups. Enabling Investments!',
    description: 'Number Leader is a comprehensive platform designed to connect startups, investors, and enablers in the ecosystem.',
    url: 'https://numberleader.com/',
    siteName: 'Number Leader',
    images: [
      {
        url: '/assets/img/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Number Leader - Empowering Startups. Enabling Investments!',
    description: 'Number Leader is a comprehensive platform designed to connect startups, investors, and enablers in the ecosystem.',
    images: ['/assets/img/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${poppins.variable} ${roboto.variable} ${haettenschweiler.variable}`}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/img/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/img/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/assets/img/favicon/site.webmanifest" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
} 