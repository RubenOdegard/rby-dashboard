import ContentRenderer from "@/components/sections/content-renderer";
import { Diagnostics } from "@/components/sections/diagnostics";

export default function Home() {
	return (
		<main className="mt-32 flex min-h-screen flex-col items-center">
			<Diagnostics />
			<ContentRenderer />
		</main>
	);
}
