import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SAT Connect | El SaaS para Proveedores de Tours",
  description: "Vende tus tours en todo el mundo, sin complicaciones.",
  icons: {
    icon: [
      { url: '/sidebar-logo-closed.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/sidebar-logo-open.png', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: '/sidebar-logo-closed.ico',
    apple: '/sidebar-logo-open.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100 antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
