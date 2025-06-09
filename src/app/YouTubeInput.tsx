"use client";

import { useState } from "react";
import { isValidYouTubeUrl } from "../utils/validation";

export function YouTubeInput() {
  const [videoUrl, setVideoUrl] = useState("");
  const [touched, setTouched] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const isValid = isValidYouTubeUrl(videoUrl);
  const showError = touched && videoUrl && !isValid;
  const handleSubmit = async (videoUrl: string) => {
    if (!isValid) return;
    setLoading(true);
    setContent("");
    try {
      const response = await fetch("/api/video-analysis", {
        method: "POST",
        body: JSON.stringify({ videoUrl }),
      });
      const data = await response.json();
      setContent(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
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
          disabled={!videoUrl.trim() || !isValid || loading}
          onClick={() => {handleSubmit(videoUrl)}}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          {loading ? 'Loading...' : 'Analyze Video'}
        </button>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        ) : null}
        {content && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-zinc-300 mb-2">Video Analysis</h3>
            <p className="text-zinc-300">{content}</p>
          </div>
        )}
      </div>
    </div>
  );
}
