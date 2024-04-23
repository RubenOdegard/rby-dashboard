import { Diagnostics } from "@/components/sections/diagnostics";
import ContentRenderer from "@/components/sections/content-renderer";
import TitleHeader from "@/components/title-header";

// TODO: Try to move client logic away from ContentRenderer and MainTabs -> into smaller invidivual components that needs the data
// TODO: Render a pretty list of categories and the urls in each category under a specific project (reuse components from Collections)
// FIX: Fix sizing of "+" button on both Collection and Project tabs.
// TODO: Add the ability to delete a project from the database (this needs to also delete all project_urls associated with the project)

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center px-4 sm:p-8 lg:p-24">
			<TitleHeader />
			<Diagnostics />
			<ContentRenderer />
		</main>
	);
}
