"use client";
import { Diagnostics } from "@/components/diagnostics";
import ContentRenderer from "@/components/content-renderer";
import TitleHeader from "@/components/title-header";
//import { db } from "@/db/db";
//const result = await db.select().from(urls).all();

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-8 sm:p-8 lg:p-24">
      {/*  <span>{JSON.stringify(result)}</span> */}
      {/* Header with title and github link */}
      <TitleHeader />
      {/* Diagnostics for failed urls */}
      <Diagnostics />
      {/* ContentRenderer renders the actual content on the site*/}
      <ContentRenderer />
    </main>
  );
}
