"use client";

import { ThemeProvider } from "@/app/_providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { useStore } from "@/stores/store";
import type { ReactNode } from "react";

const LayoutProvider = ({
	children,
}: Readonly<{
	children: ReactNode;
}>) => {
	useStore();
	return (
		<ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange={true}>
			{children}
			<Toaster />
		</ThemeProvider>
	);
};

export default LayoutProvider;
