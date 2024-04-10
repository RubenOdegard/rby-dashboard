import { Diagnostics } from "@/components/diagnostics";
import ContentRenderer from "@/components/content-renderer";
import TitleHeader from "@/components/title-header";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 sm:p-8 lg:p-24">
      <TitleHeader />
      <Diagnostics />
      <ContentRenderer />
    </main>
  );
}
