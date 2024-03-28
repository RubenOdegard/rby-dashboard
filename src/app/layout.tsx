import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LayoutProvider from "./layout-provider";
import AuthProvider from "./auth-provider";

const inter = Inter({ subsets: ["latin"] });

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
				className={
					(cn(inter.className),
					"min-h-screen bg-background font-sans antialiased")
				}
			>
				<AuthProvider>
					<LayoutProvider>{children}</LayoutProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
