# Specification

## Summary
**Goal:** Add thumbnail support to videos in Creator Studio, allowing creators to upload, store, and display custom thumbnail images for their videos.

**Planned changes:**
- Extend the backend video record with an optional thumbnail blob field
- Add backend endpoints to upload/update and retrieve a video thumbnail, restricted to the video owner
- Add an optional "Thumbnail (optional)" image file picker (JPEG, PNG, WebP) to the Upload Video page with a preview before submission
- Display the thumbnail in the VideoCard component, falling back to a placeholder when none is set
- Use the thumbnail as the poster image on the Video Player page before playback begins

**User-visible outcome:** Creators can optionally upload a thumbnail when uploading a video. Thumbnails appear on video cards in the browse view and as the poster image on the video player page. Cards without a thumbnail show a neutral placeholder.
