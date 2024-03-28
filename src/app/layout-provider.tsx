import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/sonner";

const LayoutProvider = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
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
