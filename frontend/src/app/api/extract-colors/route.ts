import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const imageUrl = searchParams.get("url");

	if (!imageUrl) {
		return NextResponse.json(
			{ error: "Image URL is required" },
			{ status: 400 },
		);
	}

	try {
		// Fetch the image
		const response = await fetch(imageUrl);

		if (!response.ok) {
			throw new Error(`Failed to fetch image: ${response.statusText}`);
		}

		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Return the image with CORS headers
		return new NextResponse(buffer, {
			headers: {
				"Content-Type": response.headers.get("content-type") || "image/jpeg",
				"Access-Control-Allow-Origin": "*",
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	} catch (error) {
		console.error("Error proxying image:", error);
		return NextResponse.json(
			{ error: "Failed to proxy image" },
			{ status: 500 },
		);
	}
}
