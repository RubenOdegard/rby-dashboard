"use client"

import { Toaster } from "@/components/ui/sonner";
import { useStore } from "@/stores/store";
import { ThemeProvider } from "@/app/_providers/theme-provider";

const LayoutProvider = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    useStore()
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
        >
            {children}
            <Toaster />
        </ThemeProvider>
    );
};

export default LayoutProvider;
