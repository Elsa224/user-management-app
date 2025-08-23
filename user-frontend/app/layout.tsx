import { ThemeProvider } from "@/components/ui/theme-provider";
import { Providers } from "@/lib/providers";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Nunito } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const nunito = Nunito({
    variable: "--font-nunito",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "User Management System",
    description: "A comprehensive user management dashboard",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${nunito.variable} font-nunito antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Providers>{children}</Providers>
                        <Toaster
                            richColors
                            duration={3000}
                            closeButton
                            position="top-right"
                        />
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
