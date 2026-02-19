import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter', display: 'swap' });
const syne = Syne({ subsets: ["latin"], variable: '--font-syne', weight: ['400', '600', '700', '800'], display: 'swap' });

export const metadata: Metadata = {
  title: "SAT Connect | El SaaS para Proveedores de Tours y Actividades",
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

import { ThemeProvider } from "@/components/theme-provider";

import { ClerkProvider } from "@clerk/nextjs"; // Added ClerkProvider

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <body className={`${inter.variable} ${syne.variable} font-sans bg-gray-50 dark:bg-[#07101E] text-gray-900 dark:text-gray-100 antialiased selection:bg-[#29FFC6] selection:text-[#07101E]`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
