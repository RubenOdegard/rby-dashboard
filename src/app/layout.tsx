import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import AuthProvider from "@/app/_providers/auth-provider";
import LayoutProvider from "@/app/_providers/layout-provider";

export const metadata: Metadata = {
    title: "Developer Dashboard",
    description: "A developer dashboard to manage your tools and dependencies.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body
                className={cn(
                    "relative min-h-screen bg-background font-sans antialiased",
                    GeistSans.variable,
                    GeistMono.variable,
                )}
            >
                <AuthProvider>
                    <LayoutProvider>{children}</LayoutProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
