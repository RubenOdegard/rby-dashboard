import iconv from "iconv-lite";
import { type NextRequest, NextResponse } from "next/server";
import { parse } from "node-html-parser";

// biome-ignore lint/style/useNamingConvention: <Nextjs route naming convention>
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const url = searchParams.get("url");

	if (!url) {
		return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
	}

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error("Failed to fetch URL");
		}

		const contentType = response.headers.get("Content-Type") || "";
		let encoding = "utf-8"; // Default encoding

		// WARN: MAGIC
		const match = contentType.match(/charset=([^;]+)/);
		if (match?.[1]) {
			encoding = match[1];
		}

		// Convert the content if it's not UTF-8
		const htmlBuffer = await response.arrayBuffer();
		const html = iconv.decode(Buffer.from(htmlBuffer), encoding);
		const root = parse(html);

		const title = root.querySelector("title")?.text || "";
		const description =
			root.querySelector('meta[name="description"]')?.getAttribute("content") ||
			root.querySelector('meta[name="Description"]')?.getAttribute("content") ||
			root.querySelector('meta[property="og:description"]')?.getAttribute("content") ||
			"";

		const imageUrl = root.querySelector('meta[property="og:image"]')?.getAttribute("content") || "";
		const domain = url;

		return new Response(JSON.stringify({ title, description, imageUrl, domain }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error fetching metadata:", error);
		return NextResponse.error();
	}
}
