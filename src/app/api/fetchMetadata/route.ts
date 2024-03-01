import { NextRequest, NextResponse } from "next/server";
import cheerio from "cheerio";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  try {
    if (!url) {
      return NextResponse.error();
    }

    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content");
    const imageUrl = $('meta[property="og:image"]').attr("content");

    return new Response(JSON.stringify({ title, description, imageUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return NextResponse.error();
  }
}
