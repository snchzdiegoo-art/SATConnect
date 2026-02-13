import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-montserrat' });

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} font-sans bg-gray-50 dark:bg-[#050F1A] text-gray-900 dark:text-gray-100 antialiased selection:bg-[#29FFC6] selection:text-[#050F1A]`}>
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
  );
}
