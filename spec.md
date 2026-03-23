# Florida Dave Pier Fishing

## Current State
Fishing game has a GameBottomNav fixed at the bottom (64px), a floating boost button, game buttons panel, and a Pier Rewards page. The game supports reward boosts but lacks a direct "I got my Cameo" claim button.

## Requested Changes (Diff)

### Add
- Fixed "🎥 I GOT MY CAMEO" button above the bottom nav bar
- Modal popup when clicked with:
  - Title: "CLAIM YOUR REWARD"
  - Message: "Thank you for supporting Florida Dave! Choose your reward:"
  - 6 reward buttons: Double Coins, Lucky Cast, VIP Fisher, Rare Fish Boost, Coin Rush, Mystery Bonus
  - Each reward activates its corresponding game boost (matching existing reward logic)
  - Only one reward per claim; 10-minute cooldown after claiming
  - Close/cancel option

### Modify
- FishingGamePage.tsx: add CameoRewardModal state and button

### Remove
- Nothing

## Implementation Plan
1. Add `cameoModalOpen` state and `cameoClaimedUntil` state to FishingGamePage
2. Add the fixed "I GOT MY CAMEO" button positioned above the bottom nav (bottom: 80px)
3. Add the modal popup with 6 reward buttons that apply their respective boosts
4. Wire each reward to existing boost logic (doubleCoinsActive, luckyBoost, etc.)
5. Show 10-minute cooldown timer on button after claim
