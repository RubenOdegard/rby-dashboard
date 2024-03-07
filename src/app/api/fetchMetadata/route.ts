import { NextRequest, NextResponse } from "next/server";
import cheerio from "cheerio";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  // Check if URL is provided
  if (!url) {
    return NextResponse.error();
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Get title from metadata (use first title tag to not fetch WCAG titles for svgs, learned the hard way.)
    let title = $("title:first").text() || "";

    // Get description from metadata
    let description = $('meta[name="description"]').attr("content");
    // If no description, fetch from capitalized description tag
    if (!description) {
      description = $('meta[name="Description"]').attr("content");
    }
    // If still no description, use open graph description if available
    if (!description) {
      description = $('meta[property="og:description"]').attr("content");
    }

    // Fetch image
    let imageUrl = $('meta[property="og:image"]').attr("content") || "";

    // Fetch url
    let domain = url;

    return new Response(
      JSON.stringify({ title, description, imageUrl, domain }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.error();
  }
}
