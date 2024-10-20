import AuthProvider from "@/app/_providers/auth-provider";
import LayoutProvider from "@/app/_providers/layout-provider";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
	title: "RBY Dashboard",
	description:
		"A self-hosted dashboard for managing a collection of development tools and various URLs, either standalone or linked to projects.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body
				className={cn(
					"relative min-h-screen bg-background  font-sans antialiased ",
					GeistSans.variable,
					GeistMono.variable,
				)}
			>
				<AuthProvider>
					<LayoutProvider>
						<header>
							<Header />
						</header>
						{children}
					</LayoutProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
