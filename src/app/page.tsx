import { Diagnostics } from "@/components/sections/diagnostics";
import ContentRenderer from "@/components/sections/content-renderer";
import TitleHeader from "@/components/title-header";

// TODO: Try to move client logic away from ContentRenderer and MainTabs -> into smaller invidivual components that needs the data
//
// TODO: Render a pretty list of categories and the urls in each category under a specific project (reuse components from Collections)
// Remember to add animations to this list as well to match the collection list.
//
// FIX: Fix sizing of "+" button on both Collection and Project tabs.
//
// FIX: Sort the collections alphabetically?
//
// FIX: Sort the projects_urls and their categories alphabetically?
//
// TODO: Add the ability to delete a project from the database (this needs to also delete all project_urls associated with the project)
//
// TODO: Add a "history" drawer components that shows all the changes that have been made to collections or projects. (with a clear button to clear the history)

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center px-4 sm:p-8 lg:p-24">
            <TitleHeader />
            <Diagnostics />
            <ContentRenderer />
        </main>
    );
}
