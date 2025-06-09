"use client";

import { useState } from "react";
import { isValidYouTubeUrl } from "../utils/validation";

export function YouTubeInput() {
  const [videoUrl, setVideoUrl] = useState("");
  const [touched, setTouched] = useState(false);
  const isValid = isValidYouTubeUrl(videoUrl);
  const showError = touched && videoUrl && !isValid;
  const handleSubmit = async (videoUrl: string) => {
    if (!isValid) return;
    console.log('Frontend Fetch:', videoUrl);
    const response = await fetch("/api/video-analysis", {
      method: "POST",
      body: JSON.stringify({ videoUrl }),
    });
    const data = await response.json();
    console.log(data);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="youtube-url"
            className="block text-sm font-medium text-zinc-300 mb-2"
          >
            YouTube Video URL
          </label>
          <input
            id="youtube-url"
            type="url"
            value={videoUrl}
            onChange={e => { setVideoUrl(e.target.value); setTouched(true); }}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {showError && (
            <p className="text-red-500 text-xs mt-2">Please enter a valid YouTube video URL.</p>
          )}
        </div>

        <button
          type="button"
          disabled={!videoUrl.trim() || !isValid}
          onClick={() => {handleSubmit(videoUrl)}}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          Analyze Video
        </button>
      </div>
    </div>
  );
}
