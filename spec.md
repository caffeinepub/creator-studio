# Florida Dave Video Requests

## Current State
The app has multiple pages: VideoFeedPage, ProfilePage, OwloadVideoPage, OwnerDashboardPage, VideoPlayerPage, FishingGamePage. Navigation is handled by NavigationBar with links to Videos, Profile, Pier Fishing, Upload, and Dashboard.

## Requested Changes (Diff)

### Add
- New page `/pier-gear` — Florida Dave Pier Gear merch page with Florida fishing pier aesthetic, dark blue ocean tones
- Nav link "Pier Gear" in NavigationBar pointing to `/pier-gear`
- Hero section with title "Florida Dave Pier Gear", subtitle "Official Fishing Gear from the Florida Dave Network", and description text
- 4 product cards: Florida Dave Network Shirt (Pre-Order), Florida Dave Sun Protection Fishing Hat (Pre-Order), Florida Dave Fishing Bag (Pre-Order), Florida Dave Solar Fish Cooker (Coming Soon)
- Each card: product name, description, image placeholder area, CTA button (Coming Soon or Pre-Order)
- Bottom banner: "More Florida Dave gear coming soon."

### Modify
- App.tsx: add `/pier-gear` route pointing to new PierGearPage
- NavigationBar.tsx: add Pier Gear nav link

### Remove
- Nothing

## Implementation Plan
1. Create `src/frontend/src/pages/PierGearPage.tsx` with hero, product cards grid, and bottom banner
2. Update `src/frontend/src/App.tsx` to add the route
3. Update `src/frontend/src/components/NavigationBar.tsx` to add nav link
