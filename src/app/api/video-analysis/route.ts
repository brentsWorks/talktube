import { GoogleGenerativeAI } from "@google/generative-ai";
import { YoutubeTranscript } from 'youtube-transcript';
import { NextRequest, NextResponse } from "next/server";
import { isValidYouTubeUrl } from "@/utils/validation";

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
    const videoId = new URL(videoUrl).searchParams.get('v');
    const transcript = await YoutubeTranscript.fetchTranscript(videoId!);
    console.log("Transcript:", transcript);

    if (!transcript || transcript.length === 0) {
      console.error("No transcript found for video:", videoUrl);
      return NextResponse.json(
        { error: "No transcript available for this video. It may be private, restricted, or not have captions." },
        { status: 404 }
      );
    }

    // TODO: Add video analysis logic here
    // This could include:
    // - File upload handling
    // - Video processing
    // - AI/ML analysis
    // - Database operations

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent([
      `Analyze the following transcript and provide a summary of the video in 3 sentences.
      
      <VideoTranscript> 
        Transcript: ${transcript.map((t) => t.text).join(" ")}
      </VideoTranscript>
      `,
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
