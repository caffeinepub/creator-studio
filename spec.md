# Specification

## Summary
**Goal:** Allow users to upload an optional thumbnail image alongside their video, display it in video cards and the video player.

**Planned changes:**
- Add an optional thumbnail file input (PNG, JPG, GIF, WebP) to the Upload Video form, with a preview before submission
- Pass the thumbnail blob to the upload mutation alongside the video; proceed normally if no thumbnail is selected
- Extend backend Video records with a nullable thumbnail blob field; update the upload endpoint to accept and store it; return it in video retrieval responses
- Update VideoCard to render the thumbnail image when present, falling back to the existing placeholder/gradient when absent
- Set the video element's `poster` attribute in VideoPlayerPage to the thumbnail data URL when available

**User-visible outcome:** Users can optionally attach a thumbnail image when uploading a video. The thumbnail appears on video cards and as the poster image in the video player before playback begins. Videos without thumbnails continue to work as before.
