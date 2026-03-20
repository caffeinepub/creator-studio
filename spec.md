# Florida Dave Fishing Game – Leaderboard System

## Current State
The fishing game (FishingGamePage.tsx) has a Kraken Risk System with banked points and current points tracked in component state. There is no leaderboard, no score submission, and no persistence across sessions. All state is lost on refresh.

## Requested Changes (Diff)

### Add
- Leaderboard data persistence using localStorage (keyed per app)
- LeaderboardPage component at `/leaderboard` route showing top 10 players ranked by banked points
- "View Leaderboard" button on the fishing game main screen
- New High Score popup: shown when session ends (player resets or game over) and new banked points exceed stored personal high score
  - Title: "🎉 NEW HIGH SCORE!"
  - Subtext: "Submit your score to the leaderboard?"
  - Input for player name (with random fallback: FishMaster, PierLegend, KrakenHunter, etc.)
  - "Submit Score" and "Skip" buttons
- Leaderboard display:
  - Title: "🏆 Florida Dave Pier Leaderboard"
  - Top 10 entries with rank, player name, banked points
  - Gold/silver/bronze styling for top 3; #1 player visually prominent
  - Mobile-friendly, Florida beach theme
- New route in App.tsx for leaderboard page

### Modify
- FishingGamePage: track when banked points represent a new personal high score; trigger submission popup on game reset or when player explicitly wants to submit
- Add a "View Leaderboard" button in the game UI (near cast button area)
- Score submission: compare current session's peak banked points against stored leaderboard entries for the same player name

### Remove
- Nothing removed

## Implementation Plan
1. Create leaderboard utility (src/frontend/src/lib/leaderboard.ts) with read/write functions using localStorage
2. Create LeaderboardPage component (src/frontend/src/pages/LeaderboardPage.tsx) with full UI
3. Add leaderboard route to App.tsx
4. Modify FishingGamePage to:
   - Track peak banked points during a session
   - Show high score submission popup when appropriate
   - Add "View Leaderboard" button
5. High score check: when banked points increase, compare to top leaderboard entry for that device; if higher, mark as new high score candidate
