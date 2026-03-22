# Florida Dave Pier Fishing — Game UI Buttons Panel

## Current State
FishingGamePage.tsx contains the full fishing mini-game with Kraken Risk System, leaderboard, reset, and simulated rewarded ad buttons. The game uses a Florida beach theme with ocean colors.

## Requested Changes (Diff)

### Add
- New `GameButtonsPanel` component with 6 arcade-style game UI buttons:
  1. 🎣 Get Lucky Boost (featured, glowing gold, floating FAB)
  2. 💰 Double Coins
  3. 😂 Roast Me / Bless Me (split/dual style)
  4. 🎰 Spin the Dave Wheel
  5. 🏆 VIP Fisher (black + gold premium)
  6. 🐟 Legendary Hunt
- Click popups with fun Florida Dave personality text for each button
- Bottom navigation bar with: Fish, Shop, Leaderboard, Cameo tabs
- Floating action button for "Get Lucky Boost" fixed at bottom-right
- Dark blue + gold glow color scheme for buttons
- Hover glow, pulse animations, and press feedback on all buttons

### Modify
- FishingGamePage.tsx — integrate GameButtonsPanel section below existing game controls; add bottom nav bar; ensure pb-20 padding for bottom nav clearance

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/components/GameButtonsPanel.tsx` with all 6 buttons, popup dialogs, and arcade animations
2. Create `src/frontend/src/components/GameBottomNav.tsx` with Fish/Shop/Leaderboard/Cameo tabs fixed at bottom
3. Create `src/frontend/src/components/FloatingBoostButton.tsx` for the floating Get Lucky Boost FAB
4. Integrate all three into FishingGamePage.tsx
5. Add CSS keyframe animations (gold pulse, glow, shimmer) to index.css
6. Update tailwind config with dark blue + gold design tokens if needed
