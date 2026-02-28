# Specification

## Summary
**Goal:** Allow authenticated fans to follow/unfollow FloridaDave on the creator's profile page, with real-time follower count updates.

**Planned changes:**
- Add backend Motoko storage for follower relationships, with query functions for follower count and follow-status checks, and update functions to follow/unfollow (preventing self-follows)
- Add a Follow/Following toggle button on the profile page that shows a login prompt to unauthenticated visitors
- Display and update the follower count in real time after follow/unfollow actions
- Add `useFollowCreator`, `useUnfollowCreator`, `useFollowerCount`, and `useIsFollowing` hooks in `useQueries.ts`, with mutations that invalidate relevant queries and show a loading state on the button

**User-visible outcome:** Fans can follow or unfollow FloridaDave from the profile page; the follower count updates immediately, and unauthenticated visitors are prompted to log in before following.
