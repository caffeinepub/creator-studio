# Specification

## Summary
**Goal:** Fix videos not loading or displaying on the VideoPlayerPage and ensure video thumbnails appear correctly on the VideoFeedPage.

**Planned changes:**
- Investigate and fix the video source construction so the HTML video element correctly receives and renders the video URL or blob from the backend.
- Ensure the VideoPlayerPage renders the video without a blank/black screen and without console errors related to src, CORS, or missing blob/URL.
- Ensure each VideoCard on the VideoFeedPage displays a thumbnail image or a styled fallback placeholder.
- Ensure clicking a VideoCard navigates to the correct VideoPlayerPage for that video.

**User-visible outcome:** Users can see and play their uploaded videos on the VideoPlayerPage, and video thumbnails (or placeholders) are visible on the VideoFeedPage.
