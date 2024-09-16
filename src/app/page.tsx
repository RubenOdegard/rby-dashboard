import ContentRenderer from "@/components/sections/content-renderer";
import { Diagnostics } from "@/components/sections/diagnostics";

// TODO: ? Add a settings drawer, which holds [logout, toggle notes, history] ?

// TODO: When creating a new project, make sure to automaticly redirect to the new project.
//
// WARN: Fetching metadata needs a shorter timeout, 10 seconds are too long.
//

export default function Home() {
	return (
		<main className="mt-32 flex min-h-screen flex-col items-center">
			<Diagnostics />
			<ContentRenderer />
		</main>
	);
}
