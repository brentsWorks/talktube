import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv'

import { NextRequest, NextResponse } from "next/server";
import { isValidYouTubeUrl } from "@/utils/validation";

dotenv.config();
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate input
    if (!body || !body.videoUrl || !isValidYouTubeUrl(body.videoUrl)) {
      return NextResponse.json(
        { error: "A valid YouTube video URL is required" },
        { status: 400 }
      );
    }

    const videoUrl = body.videoUrl;
    // TODO: Add video analysis logic here
    // This could include:
    // - File upload handling
    // - Video processing
    // - AI/ML analysis
    // - Database operations

    // Placeholder response
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([
      "Please summarize the video in 3 sentences.",
      {
        fileData: {
          fileUri: videoUrl,
          mimeType: "video/mp4",
        },
      },
    ]);
    console.log(result.response.text());
    return NextResponse.json(result.response.text(), { status: 200 });
  } catch (error) {
    console.error("Video analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
