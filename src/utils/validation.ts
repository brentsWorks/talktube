// YouTube URL validation utility
export function isValidYouTubeUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    // Accept both youtube.com and youtu.be
    if (
      (parsed.hostname === "www.youtube.com" || parsed.hostname === "youtube.com") &&
      parsed.pathname === "/watch" &&
      parsed.searchParams.has("v")
    ) {
      return true;
    }
    if (
      parsed.hostname === "youtu.be" &&
      parsed.pathname.length > 1 // e.g., /VIDEO_ID
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
} 