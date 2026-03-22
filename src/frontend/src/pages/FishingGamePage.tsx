import { FloatingBoostButton } from "@/components/FloatingBoostButton";
import { GameBottomNav } from "@/components/GameBottomNav";
import { GameButtonsPanel } from "@/components/GameButtonsPanel";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getPersonalBest,
  getRandomName,
  setPersonalBest,
  submitScore,
} from "../lib/leaderboard";

type GameState =
  | "idle"
  | "casting"
  | "waiting"
  | "biting"
  | "reeled"
  | "missed";

type KrakenPhase = "none" | "challenge" | "outcome";
type KrakenOutcome = "win" | "lose" | null;

interface Catch {
  emoji: string;
  name: string;
  description: string;
  points: number;
  rarity: "common" | "uncommon" | "rare" | "legendary" | "godlike";
}

const GOLDEN_FISH: Catch = {
  emoji: "🌟",
  name: "Golden Florida Dave Fish",
  description: "LEGENDARY CATCH! The Florida Dave Fish!",
  points: 100,
  rarity: "godlike",
};

const CATCH_POOL: Array<Catch & { weight: number }> = [
  {
    emoji: "🐟",
    name: "Bass",
    description: "A feisty Florida bass!",
    points: 10,
    rarity: "common",
    weight: 30,
  },
  {
    emoji: "🐠",
    name: "Snook",
    description: "Snook season is ON!",
    points: 15,
    rarity: "common",
    weight: 25,
  },
  {
    emoji: "🐡",
    name: "Grouper",
    description: "A chunky grouper!",
    points: 20,
    rarity: "uncommon",
    weight: 18,
  },
  {
    emoji: "🐬",
    name: "Tarpon",
    description: "Silver king on the line!",
    points: 25,
    rarity: "uncommon",
    weight: 10,
  },
  {
    emoji: "🦀",
    name: "Crab",
    description: "Pinchy!",
    points: 8,
    rarity: "common",
    weight: 15,
  },
  {
    emoji: "🦈",
    name: "Shark",
    description: "Hang on tight!",
    points: 50,
    rarity: "rare",
    weight: 4,
  },
  {
    emoji: "👞",
    name: "Old Boot",
    description: "Classic Florida find.",
    points: 2,
    rarity: "common",
    weight: 20,
  },
  {
    emoji: "👡",
    name: "Tourist Sandal",
    description: "Still has sand in it.",
    points: 1,
    rarity: "common",
    weight: 18,
  },
  {
    emoji: "🧴",
    name: "Sunscreen Bottle",
    description: "SPF 100 — half full!",
    points: 3,
    rarity: "common",
    weight: 12,
  },
  {
    emoji: "🩴",
    name: "Flip Flop",
    description: "Lost off the pier.",
    points: 2,
    rarity: "common",
    weight: 16,
  },
  {
    emoji: "💰",
    name: "Treasure Chest",
    description: "Arrr! Jackpot!",
    points: 100,
    rarity: "legendary",
    weight: 1,
  },
];

const TOTAL_WEIGHT = CATCH_POOL.reduce((s, c) => s + c.weight, 0);

function getRandomCatch(): Catch {
  if (Math.random() < 1 / 500) return GOLDEN_FISH;
  let r = Math.random() * TOTAL_WEIGHT;
  for (const c of CATCH_POOL) {
    r -= c.weight;
    if (r <= 0) return c;
  }
  return CATCH_POOL[0];
}

const RARITY_COLOR: Record<string, string> = {
  common: "#64b5f6",
  uncommon: "#81c784",
  rare: "#ff8a65",
  legendary: "#ffd700",
  godlike: "#ffd700",
};

const RARITY_LABEL: Record<string, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare!",
  legendary: "🌟 LEGENDARY!",
  godlike: "🌟✨ GODLIKE LEGENDARY! ✨🌟",
};

const UNLOCK_MILESTONES = [
  { points: 500, label: "Basic Rod Upgrade 🎣", icon: "🎣" },
  { points: 1000, label: "Rare Bait 🦑", icon: "🦑" },
  { points: 5000, label: "Legendary Fish Unlock 🐉", icon: "🐉" },
  { points: 10000, label: "Golden Florida Dave Fish 🌟", icon: "🌟" },
];

interface CatchEntry {
  id: number;
  catch: Catch;
  boosted?: boolean;
}

const PARTICLES = [
  { id: "p1", top: "-15%", left: "10%", delay: "0s", dur: "1.8s", icon: "✨" },
  {
    id: "p2",
    top: "-10%",
    left: "40%",
    delay: "0.2s",
    dur: "2.2s",
    icon: "⭐",
  },
  {
    id: "p3",
    top: "-18%",
    left: "75%",
    delay: "0.4s",
    dur: "1.6s",
    icon: "✨",
  },
  { id: "p4", top: "20%", left: "-12%", delay: "0.6s", dur: "2s", icon: "🌟" },
  {
    id: "p5",
    top: "60%",
    left: "-15%",
    delay: "0.1s",
    dur: "1.9s",
    icon: "✨",
  },
  { id: "p6", top: "100%", left: "5%", delay: "0.3s", dur: "2.1s", icon: "⭐" },
  {
    id: "p7",
    top: "105%",
    left: "40%",
    delay: "0.5s",
    dur: "1.7s",
    icon: "✨",
  },
  {
    id: "p8",
    top: "100%",
    left: "75%",
    delay: "0.7s",
    dur: "2.3s",
    icon: "🌟",
  },
  {
    id: "p9",
    top: "60%",
    left: "105%",
    delay: "0.9s",
    dur: "1.8s",
    icon: "✨",
  },
  { id: "p10", top: "20%", left: "108%", delay: "0.2s", dur: "2s", icon: "⭐" },
  { id: "p11", top: "-5%", left: "25%", delay: "1s", dur: "1.5s", icon: "✨" },
  {
    id: "p12",
    top: "-5%",
    left: "60%",
    delay: "0.8s",
    dur: "2.4s",
    icon: "⭐",
  },
  {
    id: "p13",
    top: "40%",
    left: "-8%",
    delay: "1.2s",
    dur: "1.6s",
    icon: "✨",
  },
  {
    id: "p14",
    top: "40%",
    left: "105%",
    delay: "0.4s",
    dur: "2.2s",
    icon: "🌟",
  },
];

function getNextKrakenTrigger() {
  return 5 + Math.floor(Math.random() * 11); // 5–15
}

export default function FishingGamePage() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [bankedPoints, setBankedPoints] = useState(0);
  const [lastCatch, setLastCatch] = useState<Catch | null>(null);
  const [catchLog, setCatchLog] = useState<CatchEntry[]>([]);
  const [reelCountdown, setReelCountdown] = useState(3);
  const [bobberLeft, setBobberLeft] = useState(50);
  const [showCastLine, setShowCastLine] = useState(false);
  const [showLegendaryPopup, setShowLegendaryPopup] = useState(false);
  const [krakenPhase, setKrakenPhase] = useState<KrakenPhase>("none");
  const [krakenOutcome, setKrakenOutcome] = useState<KrakenOutcome>(null);
  const [catchesSinceKraken, setCatchesSinceKraken] = useState(0);
  const [krakenTriggerAt, setKrakenTriggerAt] = useState(() =>
    getNextKrakenTrigger(),
  );
  const [unlockedMilestones, setUnlockedMilestones] = useState<number[]>([]);
  const [newUnlock, setNewUnlock] = useState<string | null>(null);

  // Leaderboard state
  const [peakBanked, setPeakBanked] = useState(0);
  const [showHighScorePopup, setShowHighScorePopup] = useState(false);
  const [playerNameInput, setPlayerNameInput] = useState(() => getRandomName());
  const [submittedToLeaderboard, setSubmittedToLeaderboard] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Ad system state
  const [krakenShields, setKrakenShields] = useState(0);
  const [hasBonusCatch, setHasBonusCatch] = useState(false);
  const [lastLostPoints, setLastLostPoints] = useState(0);
  const [showKrakenRecovery, setShowKrakenRecovery] = useState(false);
  const [adWatching, setAdWatching] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [_pendingAdType, setPendingAdType] = useState<
    "recovery" | "shield" | "bonus" | null
  >(null);
  const [adToast, setAdToast] = useState<string | null>(null);
  const adCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const catchRef = useRef<Catch | null>(null);
  const catchIdRef = useRef(0);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (adCountdownRef.current) clearInterval(adCountdownRef.current);
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // Track peak banked points
  useEffect(() => {
    if (bankedPoints > peakBanked) {
      setPeakBanked(bankedPoints);
    }
  }, [bankedPoints, peakBanked]);

  // Check for new personal best
  useEffect(() => {
    if (
      peakBanked > 0 &&
      peakBanked > getPersonalBest() &&
      !submittedToLeaderboard
    ) {
      setPersonalBest(peakBanked);
      setShowHighScorePopup(true);
    }
  }, [peakBanked, submittedToLeaderboard]);

  // Check milestones whenever banked points change
  useEffect(() => {
    const totalBanked = bankedPoints;
    UNLOCK_MILESTONES.forEach((m, idx) => {
      if (totalBanked >= m.points && !unlockedMilestones.includes(idx)) {
        setUnlockedMilestones((prev) => [...prev, idx]);
        setNewUnlock(m.label);
        timerRef.current = setTimeout(() => setNewUnlock(null), 3500);
      }
    });
  }, [bankedPoints, unlockedMilestones]);

  function showAdToast(msg: string) {
    setAdToast(msg);
    setTimeout(() => setAdToast(null), 3000);
  }

  function grantAdReward(type: "recovery" | "shield" | "bonus") {
    if (type === "recovery") {
      setScore(lastLostPoints);
      setShowKrakenRecovery(false);
      // Resume game
      setCatchesSinceKraken(0);
      setKrakenTriggerAt(getNextKrakenTrigger());
      setKrakenPhase("none");
      setKrakenOutcome(null);
      showAdToast("Your catch was recovered!");
    } else if (type === "shield") {
      setKrakenShields((prev) => {
        const next = Math.min(prev + 1, 3);
        showAdToast(`🛡️ Kraken Shield added! (${next}/3)`);
        return next;
      });
    } else if (type === "bonus") {
      setHasBonusCatch(true);
      showAdToast("⚡ Bonus 2x Catch active!");
    }
  }

  function watchAd(type: "recovery" | "shield" | "bonus") {
    setShowKrakenRecovery(false);
    setPendingAdType(type);
    setAdCountdown(5);
    setAdWatching(true);
    let count = 5;
    adCountdownRef.current = setInterval(() => {
      count -= 1;
      setAdCountdown(count);
      if (count <= 0) {
        if (adCountdownRef.current) clearInterval(adCountdownRef.current);
        setAdWatching(false);
        setPendingAdType(null);
        grantAdReward(type);
      }
    }, 1000);
  }

  function handleAdSkip() {
    if (adCountdownRef.current) clearInterval(adCountdownRef.current);
    setAdWatching(false);
    setPendingAdType(null);
    showAdToast("Ad not completed. No reward given.");
  }

  function addCatchToLog(caught: Catch, boosted = false) {
    catchIdRef.current += 1;
    setCatchLog((log) => [
      { id: catchIdRef.current, catch: caught, boosted },
      ...log.slice(0, 4),
    ]);
  }

  function handleCast() {
    clearTimers();
    const left = 30 + Math.random() * 40;
    setBobberLeft(left);
    setShowCastLine(true);
    setGameState("casting");
    timerRef.current = setTimeout(() => {
      setGameState("waiting");
      const biteDelay = 2000 + Math.random() * 3000;
      timerRef.current = setTimeout(() => {
        catchRef.current = getRandomCatch();
        setReelCountdown(3);
        setGameState("biting");
        let count = 3;
        countdownRef.current = setInterval(() => {
          count -= 1;
          setReelCountdown(count);
          if (count <= 0) {
            clearInterval(countdownRef.current!);
            setShowCastLine(false);
            setGameState("missed");
            timerRef.current = setTimeout(() => setGameState("idle"), 2200);
          }
        }, 1000);
      }, biteDelay);
    }, 700);
  }

  function handleReel() {
    clearTimers();
    const caught = catchRef.current!;
    setShowCastLine(false);

    if (caught.rarity === "godlike") {
      setShowLegendaryPopup(true);
      timerRef.current = setTimeout(() => {
        setShowLegendaryPopup(false);
        let pts = caught.points;
        let boosted = false;
        if (hasBonusCatch) {
          pts = pts * 2;
          setHasBonusCatch(false);
          boosted = true;
          showAdToast("⚡ 2x Catch Boost applied!");
        }
        setScore((s) => s + pts);
        addCatchToLog(caught, boosted);
        setLastCatch(caught);
        setGameState("reeled");
        finishReelCycle(caught);
      }, 3000);
    } else {
      let pts = caught.points;
      let boosted = false;
      if (hasBonusCatch) {
        pts = pts * 2;
        setHasBonusCatch(false);
        boosted = true;
        showAdToast("⚡ 2x Catch Boost applied!");
      }
      setLastCatch(caught);
      setScore((s) => s + pts);
      addCatchToLog(caught, boosted);
      setGameState("reeled");
      finishReelCycle(caught);
    }
  }

  function finishReelCycle(caught: Catch) {
    const newCount = catchesSinceKraken + 1;
    setCatchesSinceKraken(newCount);

    if (newCount >= krakenTriggerAt) {
      timerRef.current = setTimeout(() => {
        setLastCatch(null);
        setGameState("idle");
        setKrakenPhase("challenge");
        setKrakenOutcome(null);
      }, 2200);
    } else {
      timerRef.current = setTimeout(() => {
        setLastCatch(null);
        setGameState("idle");
      }, 3500);
    }
    void caught;
  }

  function handleLockIn() {
    setBankedPoints((b) => b + score);
    setScore(0);
    setCatchesSinceKraken(0);
    setKrakenTriggerAt(getNextKrakenTrigger());
    setKrakenPhase("none");
  }

  function handleRiskIt() {
    const win = Math.random() < 0.5;
    const multiplier = win ? (Math.random() < 0.5 ? 2 : 3) : 0;

    if (!win && krakenShields > 0) {
      // Shield absorbs the loss
      setKrakenShields((prev) => prev - 1);
      setCatchesSinceKraken(0);
      setKrakenTriggerAt(getNextKrakenTrigger());
      setKrakenPhase("none");
      setKrakenOutcome(null);
      showAdToast("🛡️ Shield saved you!");
      return;
    }

    setKrakenOutcome(win ? "win" : "lose");
    setKrakenPhase("outcome");

    if (win) {
      setScore((s) => s * multiplier);
    } else {
      // Save lost points then zero out
      setScore((s) => {
        setLastLostPoints(s);
        return 0;
      });
    }

    if (win) {
      timerRef.current = setTimeout(() => {
        setCatchesSinceKraken(0);
        setKrakenTriggerAt(getNextKrakenTrigger());
        setKrakenPhase("none");
        setKrakenOutcome(null);
      }, 3500);
    } else {
      timerRef.current = setTimeout(() => {
        setCatchesSinceKraken(0);
        setKrakenTriggerAt(getNextKrakenTrigger());
        setKrakenPhase("none");
        setKrakenOutcome(null);
        setShowKrakenRecovery(true);
      }, 2500);
    }
  }

  function handleSubmitScore() {
    submitScore(playerNameInput || getRandomName(), peakBanked);
    setSubmittedToLeaderboard(true);
    setShowHighScorePopup(false);
    navigate({ to: "/leaderboard" });
  }

  function handleSkipHighScore() {
    setShowHighScorePopup(false);
  }

  function handleResetGame() {
    // Clear timer refs
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (adCountdownRef.current) clearInterval(adCountdownRef.current);
    // Reset all current-run state — DO NOT touch localStorage leaderboard
    setGameState("idle");
    setScore(0);
    setBankedPoints(0);
    setLastCatch(null);
    setCatchLog([]);
    setReelCountdown(3);
    setBobberLeft(50);
    setShowCastLine(false);
    setShowLegendaryPopup(false);
    setKrakenPhase("none");
    setKrakenOutcome(null);
    setCatchesSinceKraken(0);
    setKrakenTriggerAt(Math.floor(Math.random() * 11) + 5);
    setUnlockedMilestones([]);
    setNewUnlock(null);
    setPeakBanked(0);
    setShowHighScorePopup(false);
    setSubmittedToLeaderboard(false);
    setShowResetConfirm(false);
    // Ad system resets
    setKrakenShields(0);
    setHasBonusCatch(false);
    setLastLostPoints(0);
    setShowKrakenRecovery(false);
    setAdWatching(false);
    setPendingAdType(null);
    setAdToast(null);
  }

  const reelProgress = (reelCountdown / 3) * 100;
  const nextMilestone = UNLOCK_MILESTONES.find(
    (_m, i) => !unlockedMilestones.includes(i),
  );

  return (
    <div className="fishing-game-root pb-20">
      <header className="fishing-header">
        <div className="fishing-title">🎣 Florida Dave's Pier Fishing</div>
        <div className="fishing-header-right">
          <button
            type="button"
            className="leaderboard-header-btn"
            onClick={() => navigate({ to: "/leaderboard" })}
            data-ocid="fishing.leaderboard_button"
          >
            🏆 Leaderboard
          </button>
          <div className="fishing-scores">
            <div className="fishing-score" data-ocid="fishing.score_display">
              <span className="score-label">Current</span>
              <span className="score-value">{score}</span>
            </div>
            <div
              className="fishing-score banked-score"
              data-ocid="fishing.banked_display"
            >
              <span className="score-label">🏦 Banked</span>
              <span className="score-value">{bankedPoints}</span>
            </div>
            {krakenShields > 0 && (
              <div
                className="shield-display"
                data-ocid="fishing.shield_display"
              >
                🛡️ {krakenShields}/3
              </div>
            )}
          </div>
        </div>
      </header>

      {nextMilestone && (
        <div className="milestone-bar" data-ocid="fishing.milestone_bar">
          <span className="milestone-label">
            Next unlock: {nextMilestone.icon} {nextMilestone.label}
          </span>
          <span className="milestone-pts">
            {nextMilestone.points} banked pts
          </span>
        </div>
      )}

      <div className="fishing-scene">
        <div className="sky-layer">
          <div className="sun">☀️</div>
          <div className="cloud cloud-1">☁️</div>
          <div className="cloud cloud-2">⛅</div>
        </div>

        <div className="pier">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="plank" />
          ))}
          <div className="pier-post left-post" />
          <div className="pier-post right-post" />
          <div className="fishing-rod">
            <div className="rod-body" />
            {showCastLine && (
              <div
                className="fishing-line"
                style={{ left: `${bobberLeft}%` }}
              />
            )}
          </div>
        </div>

        <div className="water-layer">
          <div className="wave wave-1" />
          <div className="wave wave-2" />
          <div className="water-shimmer" />

          {(gameState === "waiting" ||
            gameState === "biting" ||
            gameState === "casting") && (
            <div
              className={`bobber-container ${
                gameState === "biting"
                  ? "biting"
                  : gameState === "casting"
                    ? "casting"
                    : "bobbing"
              }`}
              style={{ left: `${bobberLeft}%` }}
            >
              <div className="bobber-top" />
              <div className="bobber-bottom" />
            </div>
          )}

          {gameState === "biting" && (
            <div className="splash" style={{ left: `${bobberLeft}%` }}>
              💦
            </div>
          )}
        </div>

        <div className="sand-strip">
          <span className="sand-emoji">🐚</span>
          <span className="sand-emoji" style={{ animationDelay: "0.5s" }}>
            🦀
          </span>
          <span className="sand-emoji" style={{ animationDelay: "1s" }}>
            🐚
          </span>
        </div>
      </div>

      <div className="action-area">
        {gameState === "idle" && (
          <>
            <button
              type="button"
              className="cast-button"
              onClick={handleCast}
              data-ocid="fishing.cast_button"
            >
              🎣 Cast Line!
            </button>
            <button
              type="button"
              className="view-leaderboard-btn"
              onClick={() => navigate({ to: "/leaderboard" })}
              data-ocid="fishing.view_leaderboard_button"
            >
              🏆 View Leaderboard
            </button>

            {/* Bonus Catch Ad */}
            <div className="ad-btn-wrapper">
              <button
                type="button"
                className="ad-reward-btn"
                onClick={() => watchAd("bonus")}
                disabled={hasBonusCatch}
                data-ocid="fishing.bonus_catch_button"
              >
                <span className="ad-badge">AD</span>⚡ Bonus Catch Boost
              </button>
              <div className="ad-btn-sub">
                {hasBonusCatch
                  ? "Boost Active! 🟢"
                  : "Watch ad to double your next catch"}
              </div>
            </div>

            {/* Shield Ad */}
            <div className="ad-btn-wrapper">
              <button
                type="button"
                className="ad-reward-btn"
                onClick={() => watchAd("shield")}
                disabled={krakenShields >= 3}
                data-ocid="fishing.get_shield_button"
              >
                <span className="ad-badge">AD</span>
                🛡️ Get Kraken Shield
              </button>
              <div className="ad-btn-sub">
                {krakenShields >= 3
                  ? "Max shields reached (3/3)"
                  : `Watch ad for 1 shield (${krakenShields}/3)`}
              </div>
            </div>

            <button
              type="button"
              className="reset-game-btn"
              onClick={() => setShowResetConfirm(true)}
              data-ocid="fishing.reset_game_button"
            >
              🔄 Reset Game
            </button>
          </>
        )}
        {gameState === "casting" && (
          <div className="state-message casting-msg">🌊 Casting...</div>
        )}
        {gameState === "waiting" && (
          <div className="state-message waiting-msg">
            <span className="waiting-dots">🪣 Waiting for a bite</span>
            <span className="dot-anim">...</span>
          </div>
        )}
        {gameState === "biting" && (
          <div className="reel-zone">
            <div className="reel-alert">🐟 FISH ON! REEL IT IN!</div>
            <button
              type="button"
              className="reel-button"
              onClick={handleReel}
              data-ocid="fishing.reel_button"
            >
              🎣 REEL!
            </button>
            <div className="countdown-bar-wrap">
              <div
                className="countdown-bar-fill"
                style={{ width: `${reelProgress}%` }}
              />
            </div>
            <div className="countdown-num">{reelCountdown}s</div>
          </div>
        )}
        {gameState === "missed" && (
          <div className="state-message missed-msg">😢 The fish got away!</div>
        )}
        {gameState === "reeled" && !lastCatch && (
          <div className="state-message reeled-msg">🎉 Nice catch!</div>
        )}
      </div>

      {lastCatch && gameState === "reeled" && (
        <div className="catch-card" data-ocid="fishing.catch_card">
          <div className="catch-emoji">{lastCatch.emoji}</div>
          <div className="catch-info">
            <div
              className="catch-rarity"
              style={{ color: RARITY_COLOR[lastCatch.rarity] }}
            >
              {RARITY_LABEL[lastCatch.rarity]}
            </div>
            <div className="catch-name">{lastCatch.name}</div>
            <div className="catch-desc">{lastCatch.description}</div>
            <div className="catch-pts">+{lastCatch.points} pts</div>
          </div>
        </div>
      )}

      <div className="catch-log" data-ocid="fishing.catch_log">
        <div className="log-title">📋 Recent Catches</div>
        {catchLog.length === 0 ? (
          <div className="log-empty" data-ocid="fishing.catch_log.empty_state">
            Cast your line to start fishing!
          </div>
        ) : (
          <ul className="log-list">
            {catchLog.map((entry, idx) => (
              <li
                key={entry.id}
                className={`log-item${entry.catch.rarity === "godlike" ? " log-item-golden" : ""}${entry.boosted ? " log-item-boosted" : ""}`}
                data-ocid={`fishing.catch_log.item.${idx + 1}`}
              >
                <span className="log-emoji">{entry.catch.emoji}</span>
                <span className="log-name">{entry.catch.name}</span>
                {entry.boosted && <span className="log-boost-badge">⚡2x</span>}
                <span
                  className="log-pts"
                  style={{ color: RARITY_COLOR[entry.catch.rarity] }}
                >
                  +{entry.boosted ? entry.catch.points * 2 : entry.catch.points}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {unlockedMilestones.length > 0 && (
        <div className="unlocks-section" data-ocid="fishing.unlocks">
          <div className="log-title">🏆 Unlocked Rewards</div>
          <div className="unlocks-grid">
            {unlockedMilestones.map((idx) => (
              <div key={idx} className="unlock-badge">
                {UNLOCK_MILESTONES[idx].icon} {UNLOCK_MILESTONES[idx].label}
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="fishing-footer">
        © {new Date().getFullYear()}{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Built with love using caffeine.ai
        </a>
      </footer>

      {/* === LEGENDARY CATCH OVERLAY === */}
      {showLegendaryPopup && (
        <div
          className="legendary-overlay"
          data-ocid="fishing.legendary_overlay"
        >
          <div className="legendary-popup">
            <div className="legendary-rays" />
            {PARTICLES.map((p) => (
              <span
                key={p.id}
                className="legendary-particle"
                style={
                  {
                    top: p.top,
                    left: p.left,
                    "--delay": p.delay,
                    "--dur": p.dur,
                  } as React.CSSProperties
                }
              >
                {p.icon}
              </span>
            ))}
            <span className="legendary-fish-emoji">🌟</span>
            <div className="legendary-title">LEGENDARY CATCH!</div>
            <div className="legendary-subtitle">
              THE GOLDEN FLORIDA DAVE FISH!
            </div>
            <div className="legendary-pts">+100 POINTS</div>
          </div>
        </div>
      )}

      {/* === KRAKEN CHALLENGE OVERLAY === */}
      {krakenPhase === "challenge" && (
        <div className="kraken-overlay" data-ocid="fishing.kraken_overlay">
          <div className="kraken-popup">
            <div className="kraken-tentacles" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="tentacle"
                  style={{ "--i": i } as React.CSSProperties}
                />
              ))}
            </div>
            <div className="kraken-emoji">🐙</div>
            <div className="kraken-title">THE KRAKEN HAS AWAKENED</div>
            <div className="kraken-sub">
              Lock in your points or risk it all?
            </div>
            {krakenShields > 0 && (
              <div className="kraken-shield-notice">
                🛡️ You have {krakenShields} shield{krakenShields > 1 ? "s" : ""}{" "}
                — Risk It will auto-use one!
              </div>
            )}
            <div className="kraken-pts-row">
              <span className="kraken-pts-label">Current Points:</span>
              <span className="kraken-pts-value">{score}</span>
            </div>
            <div className="kraken-buttons">
              <button
                type="button"
                className="kraken-btn lock-btn"
                onClick={handleLockIn}
                data-ocid="fishing.kraken_lockin"
              >
                🏦 LOCK IN POINTS
              </button>
              <button
                type="button"
                className="kraken-btn risk-btn"
                onClick={handleRiskIt}
                data-ocid="fishing.kraken_risk"
              >
                ⚡ RISK IT
              </button>
            </div>
            <div className="kraken-banked-row">
              Banked: <strong>{bankedPoints}</strong> pts (safe)
            </div>
          </div>
        </div>
      )}

      {/* === KRAKEN OUTCOME OVERLAY === */}
      {krakenPhase === "outcome" && (
        <div className="kraken-overlay" data-ocid="fishing.kraken_outcome">
          <div
            className={`kraken-popup outcome-popup ${krakenOutcome === "win" ? "outcome-win" : "outcome-lose"}`}
          >
            <div className="outcome-emoji">
              {krakenOutcome === "win" ? "⚔️" : "💀"}
            </div>
            <div className="outcome-title">
              {krakenOutcome === "win"
                ? "YOU DEFEATED THE KRAKEN!"
                : "THE KRAKEN DESTROYED YOUR CATCH!"}
            </div>
            <div className="outcome-sub">
              {krakenOutcome === "win"
                ? `BONUS REWARD! New score: ${score}`
                : "All unbanked points lost!"}
            </div>
          </div>
        </div>
      )}

      {/* === KRAKEN RECOVERY POPUP === */}
      {showKrakenRecovery && !adWatching && (
        <div
          className="overlay kraken-recovery-overlay"
          data-ocid="fishing.recovery_modal"
        >
          <div className="recovery-popup">
            <div style={{ fontSize: "3rem" }}>🐙</div>
            <div className="recovery-title">
              The Kraken has taken everything!
            </div>
            <div className="recovery-msg">
              Watch an ad to recover your lost points?
            </div>
            <div className="recovery-pts">{lastLostPoints} pts at risk</div>
            <div className="recovery-buttons">
              <button
                type="button"
                className="recovery-btn recovery-no-btn"
                onClick={() => setShowKrakenRecovery(false)}
                data-ocid="fishing.recovery_cancel_button"
              >
                No Thanks
              </button>
              <button
                type="button"
                className="recovery-btn recovery-yes-btn"
                onClick={() => watchAd("recovery")}
                data-ocid="fishing.recovery_watch_button"
              >
                <span className="ad-badge">AD</span>
                Watch Ad to Recover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === AD WATCHING MODAL === */}
      {adWatching && (
        <div
          className="overlay ad-watching-overlay"
          data-ocid="fishing.ad_watching_modal"
        >
          <div className="ad-watching-popup">
            <div className="ad-watching-label">📺 Rewarded Ad</div>
            <div className="ad-watching-countdown">{adCountdown}s</div>
            <div className="ad-countdown-bar">
              <div
                className="ad-countdown-fill"
                style={{ width: `${((5 - adCountdown) / 5) * 100}%` }}
              />
            </div>
            <div className="ad-watching-msg">
              Watch the full ad to earn your reward
            </div>
            <button
              type="button"
              className="ad-skip-btn"
              onClick={handleAdSkip}
              data-ocid="fishing.ad_skip_button"
            >
              ✕ Skip (no reward)
            </button>
          </div>
        </div>
      )}

      {/* === HIGH SCORE POPUP === */}
      {showHighScorePopup && (
        <div className="hs-overlay" data-ocid="fishing.highscore_modal">
          <div className="hs-popup">
            <div className="hs-emoji">🎉</div>
            <div className="hs-title">NEW HIGH SCORE!</div>
            <div className="hs-sub">Submit your score to the leaderboard?</div>
            <div className="hs-score-display">
              <span className="hs-score-num">{peakBanked}</span>
              <span className="hs-score-label">banked pts</span>
            </div>
            <div className="hs-name-row">
              <label className="hs-name-label" htmlFor="hs-name-input">
                Your name:
              </label>
              <input
                id="hs-name-input"
                type="text"
                className="hs-name-input"
                value={playerNameInput}
                onChange={(e) => setPlayerNameInput(e.target.value)}
                maxLength={24}
                placeholder="Enter your name..."
                data-ocid="fishing.highscore_name_input"
              />
            </div>
            <div className="hs-buttons">
              <button
                type="button"
                className="hs-btn hs-submit-btn"
                onClick={handleSubmitScore}
                data-ocid="fishing.highscore_submit_button"
              >
                🏆 Submit Score
              </button>
              <button
                type="button"
                className="hs-btn hs-skip-btn"
                onClick={handleSkipHighScore}
                data-ocid="fishing.highscore_skip_button"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === RESET CONFIRM MODAL === */}
      {showResetConfirm && (
        <div className="reset-overlay" data-ocid="fishing.reset_modal">
          <div className="reset-popup">
            <div className="reset-title">Reset Game?</div>
            <div className="reset-msg">
              Are you sure you want to reset your current progress?
            </div>
            <div className="reset-msg reset-msg-safe">
              Your leaderboard scores will stay saved.
            </div>
            <div className="reset-buttons">
              <button
                type="button"
                className="reset-btn reset-cancel-btn"
                onClick={() => setShowResetConfirm(false)}
                data-ocid="fishing.reset_cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                className="reset-btn reset-confirm-btn"
                onClick={handleResetGame}
                data-ocid="fishing.reset_confirm_button"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === UNLOCK TOAST === */}
      {newUnlock && (
        <div className="unlock-toast" data-ocid="fishing.unlock_toast">
          🏆 UNLOCKED: {newUnlock}
        </div>
      )}

      {/* === AD TOAST === */}
      {adToast && (
        <div className="ad-toast" data-ocid="fishing.ad_toast">
          {adToast}
        </div>
      )}

      <style>{`
        .fishing-game-root {
          min-height: 100vh;
          background: linear-gradient(180deg, #87ceeb 0%, #b0e0e8 30%, #e0f4f8 50%);
          font-family: 'Outfit', 'Bricolage Grotesque', system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow-x: hidden;
        }
        .fishing-header {
          width: 100%;
          max-width: 480px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px 8px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .fishing-title {
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
          font-size: clamp(0.85rem, 3vw, 1.1rem);
          font-weight: 800;
          color: #0a4a7c;
          text-shadow: 0 1px 2px rgba(255,255,255,0.8);
          line-height: 1.2;
        }
        .fishing-header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
        }
        .leaderboard-header-btn {
          background: linear-gradient(135deg, #b8860b, #ffd700);
          color: #1a0800;
          border: none;
          border-radius: 10px;
          padding: 4px 12px;
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: 0.02em;
          box-shadow: 0 2px 8px rgba(255,215,0,0.4);
          transition: transform 0.15s;
        }
        .leaderboard-header-btn:hover { transform: translateY(-1px); }
        .fishing-scores {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
          align-items: center;
        }
        .fishing-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(135deg, #0077b6, #0096c7);
          color: white;
          border-radius: 14px;
          padding: 5px 12px;
          min-width: 58px;
          box-shadow: 0 4px 12px rgba(0,119,182,0.4);
        }
        .banked-score {
          background: linear-gradient(135deg, #1b5e20, #388e3c);
          box-shadow: 0 4px 12px rgba(27,94,32,0.4);
        }
        .score-label {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.85;
        }
        .score-value {
          font-size: 1.25rem;
          font-weight: 800;
          line-height: 1;
        }
        .milestone-bar {
          width: calc(100% - 40px);
          max-width: 440px;
          background: rgba(255,215,0,0.15);
          border: 1px solid rgba(255,215,0,0.4);
          border-radius: 12px;
          padding: 6px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 20px 6px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #7a5c00;
        }
        .milestone-pts {
          font-size: 0.72rem;
          color: #a0780a;
          font-weight: 700;
        }
        .fishing-scene {
          width: 100%;
          max-width: 480px;
          height: 280px;
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          margin: 0 12px;
          box-shadow: 0 8px 32px rgba(0, 100, 160, 0.3);
        }
        .sky-layer {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 55%;
          background: linear-gradient(180deg, #5aafed 0%, #87ceeb 60%, #b8e4f0 100%);
        }
        .sun { position: absolute; top: 10px; right: 20px; font-size: 2.2rem; animation: floatBob 4s ease-in-out infinite; filter: drop-shadow(0 0 12px rgba(255,215,0,0.8)); }
        .cloud { position: absolute; font-size: 1.8rem; animation: drift 20s linear infinite; opacity: 0.9; }
        .cloud-1 { top: 18px; left: -60px; animation-duration: 25s; }
        .cloud-2 { top: 30px; left: -80px; animation-duration: 35s; animation-delay: -12s; font-size: 1.4rem; }
        @keyframes drift { from { transform: translateX(-40px); } to { transform: translateX(520px); } }
        .pier { position: absolute; bottom: 38%; left: 0; right: 0; height: 52px; background: repeating-linear-gradient(90deg, #8B5E3C 0px, #8B5E3C 44px, #6b4423 44px, #6b4423 48px); border-top: 3px solid #a0714a; border-bottom: 2px solid #5c3a1a; }
        .plank { position: absolute; top: 4px; bottom: 4px; width: 3px; background: rgba(0,0,0,0.15); }
        .plank:nth-child(1) { left: 12%; }
        .plank:nth-child(2) { left: 24%; }
        .plank:nth-child(3) { left: 38%; }
        .plank:nth-child(4) { left: 52%; }
        .plank:nth-child(5) { left: 68%; }
        .plank:nth-child(6) { left: 82%; }
        .pier-post { position: absolute; bottom: -28px; width: 14px; height: 32px; background: linear-gradient(180deg, #6b4423, #4a2e12); border-radius: 2px 2px 0 0; }
        .left-post { left: 20%; }
        .right-post { right: 20%; }
        .fishing-rod { position: absolute; top: -24px; left: 50%; transform: translateX(-50%); width: 4px; height: 30px; }
        .rod-body { width: 4px; height: 100%; background: linear-gradient(180deg, #d4a843, #8B5E3C); border-radius: 2px; transform: rotate(20deg); transform-origin: bottom center; }
        .fishing-line { position: absolute; top: 100%; width: 1.5px; height: 120px; background: rgba(220,220,220,0.85); transform: translateX(-50%); transform-origin: top center; animation: lineSwing 0.7s ease-out; }
        @keyframes lineSwing { from { transform: translateX(-50%) scaleY(0); } to { transform: translateX(-50%) scaleY(1); } }
        .water-layer { position: absolute; bottom: 0; left: 0; right: 0; height: 42%; background: linear-gradient(180deg, #0096c7 0%, #0077b6 40%, #023e8a 100%); overflow: hidden; }
        .wave { position: absolute; top: 0; left: -50%; width: 200%; height: 20px; background: rgba(144,224,239,0.3); border-radius: 50%; animation: waveRoll 4s linear infinite; }
        .wave-2 { top: 8px; animation-duration: 5s; animation-delay: -2s; opacity: 0.5; }
        @keyframes waveRoll { from { transform: translateX(0); } to { transform: translateX(25%); } }
        .water-shimmer { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(90deg, transparent 0px, rgba(255,255,255,0.04) 4px, transparent 8px); animation: shimmerMove 3s linear infinite; }
        @keyframes shimmerMove { from { background-position: 0 0; } to { background-position: 40px 0; } }
        .bobber-container { position: absolute; top: 6px; width: 20px; height: 22px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; }
        .bobber-top { width: 16px; height: 11px; background: radial-gradient(circle at 40% 35%, #ff6b6b, #cc0000); border-radius: 50% 50% 0 0; border: 1.5px solid rgba(0,0,0,0.2); }
        .bobber-bottom { width: 16px; height: 11px; background: radial-gradient(circle at 40% 35%, #ffffff, #d0d0d0); border-radius: 0 0 50% 50%; border: 1.5px solid rgba(0,0,0,0.2); border-top: none; }
        .bobber-container.bobbing { animation: bobberFloat 1.2s ease-in-out infinite; }
        .bobber-container.biting { animation: bobberBite 0.3s ease-in-out infinite; }
        .bobber-container.casting { animation: bobberDrop 0.6s ease-out forwards; }
        @keyframes bobberFloat { 0%, 100% { transform: translateX(-50%) translateY(0px); } 50% { transform: translateX(-50%) translateY(3px); } }
        @keyframes bobberBite { 0%, 100% { transform: translateX(-50%) translateY(0px); } 50% { transform: translateX(-50%) translateY(8px); } }
        @keyframes bobberDrop { from { transform: translateX(-50%) translateY(-60px); opacity: 0; } to { transform: translateX(-50%) translateY(0px); opacity: 1; } }
        .splash { position: absolute; top: -4px; font-size: 1.4rem; transform: translateX(-50%); animation: splashAnim 0.4s ease-out infinite; pointer-events: none; }
        @keyframes splashAnim { 0% { transform: translateX(-50%) scale(0.8); opacity: 1; } 100% { transform: translateX(-50%) scale(1.4); opacity: 0.5; } }
        .sand-strip { position: absolute; bottom: 0; left: 0; right: 0; height: 0; display: flex; gap: 20%; padding: 0 16px; align-items: flex-end; pointer-events: none; }
        .sand-emoji { font-size: 1.1rem; animation: floatBob 3s ease-in-out infinite; position: relative; bottom: 2px; }
        .action-area { width: 100%; max-width: 480px; padding: 16px 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; min-height: 110px; justify-content: center; }
        .cast-button { width: 100%; max-width: 320px; height: 68px; font-size: 1.3rem; font-weight: 800; font-family: 'Bricolage Grotesque', system-ui, sans-serif; background: linear-gradient(135deg, #0077b6, #0096c7); color: white; border: none; border-radius: 20px; cursor: pointer; box-shadow: 0 6px 20px rgba(0,119,182,0.45), 0 2px 6px rgba(0,0,0,0.15); transition: transform 0.15s, box-shadow 0.15s; letter-spacing: 0.02em; }
        .cast-button:active { transform: scale(0.96); }
        .cast-button:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,119,182,0.5); }
        .view-leaderboard-btn { width: 100%; max-width: 320px; height: 48px; font-size: 1rem; font-weight: 700; font-family: 'Bricolage Grotesque', system-ui, sans-serif; background: transparent; color: #b8860b; border: 2px solid #ffd700; border-radius: 16px; cursor: pointer; box-shadow: 0 2px 8px rgba(255,215,0,0.2); transition: background 0.15s, transform 0.15s; letter-spacing: 0.02em; }
        .view-leaderboard-btn:hover { background: rgba(255,215,0,0.1); transform: translateY(-1px); }
        .view-leaderboard-btn:active { transform: scale(0.97); }
        .state-message { font-size: 1.2rem; font-weight: 700; text-align: center; padding: 16px 24px; border-radius: 16px; }
        .casting-msg { color: #0077b6; background: rgba(0,119,182,0.1); }
        .waiting-msg { color: #0a4a7c; background: rgba(0,150,199,0.1); }
        .missed-msg { color: #c62828; background: rgba(198,40,40,0.1); animation: shakeMsg 0.4s ease-in-out; }
        .reeled-msg { color: #1b5e20; background: rgba(27,94,32,0.1); }
        @keyframes shakeMsg { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        .waiting-dots { margin-right: 2px; }
        .dot-anim { display: inline-block; animation: dotPulse 1.2s steps(3, end) infinite; letter-spacing: 2px; }
        @keyframes dotPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        .reel-zone { width: 100%; max-width: 320px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .reel-alert { font-size: 1rem; font-weight: 800; color: #cc0000; text-transform: uppercase; letter-spacing: 0.08em; animation: alertPulse 0.6s ease-in-out infinite; }
        @keyframes alertPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        .reel-button { width: 100%; height: 72px; font-size: 1.5rem; font-weight: 900; font-family: 'Bricolage Grotesque', system-ui, sans-serif; background: linear-gradient(135deg, #ff6b00, #e63900); color: white; border: none; border-radius: 20px; cursor: pointer; box-shadow: 0 6px 20px rgba(230,57,0,0.5); animation: reelPulse 0.5s ease-in-out infinite; letter-spacing: 0.05em; }
        .reel-button:active { transform: scale(0.95); }
        @keyframes reelPulse { 0%, 100% { transform: scale(1); box-shadow: 0 6px 20px rgba(230,57,0,0.5); } 50% { transform: scale(1.04); box-shadow: 0 10px 30px rgba(230,57,0,0.7); } }
        .countdown-bar-wrap { width: 100%; height: 10px; background: rgba(0,0,0,0.12); border-radius: 999px; overflow: hidden; }
        .countdown-bar-fill { height: 100%; background: linear-gradient(90deg, #ff6b00, #ffd700); border-radius: 999px; transition: width 0.95s linear; }
        .countdown-num { font-size: 0.9rem; font-weight: 700; color: #cc4400; }
        .catch-card { width: calc(100% - 40px); max-width: 440px; background: white; border-radius: 20px; padding: 20px; display: flex; align-items: center; gap: 18px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); animation: catchSlideIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both; border: 2px solid rgba(0,119,182,0.15); margin: 0 20px; }
        @keyframes catchSlideIn { from { transform: translateY(40px) scale(0.85); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        .catch-emoji { font-size: 3.5rem; flex-shrink: 0; }
        .catch-info { display: flex; flex-direction: column; gap: 3px; }
        .catch-rarity { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
        .catch-name { font-size: 1.3rem; font-weight: 800; color: #0a2a4a; font-family: 'Bricolage Grotesque', system-ui, sans-serif; }
        .catch-desc { font-size: 0.85rem; color: #555; }
        .catch-pts { font-size: 1.1rem; font-weight: 800; color: #0077b6; margin-top: 2px; }
        .catch-log { width: calc(100% - 40px); max-width: 440px; background: rgba(255,255,255,0.85); backdrop-filter: blur(8px); border-radius: 20px; padding: 16px 20px; margin: 8px 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1.5px solid rgba(0,119,182,0.1); }
        .log-title { font-size: 0.85rem; font-weight: 700; color: #0a4a7c; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
        .log-empty { font-size: 0.85rem; color: #888; text-align: center; padding: 8px 0; }
        .log-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .log-item { display: flex; align-items: center; gap: 10px; padding: 6px 10px; background: rgba(0,119,182,0.06); border-radius: 10px; animation: itemFadeIn 0.3s ease-out; }
        .log-item-golden { background: linear-gradient(90deg, rgba(255,215,0,0.15), rgba(255,165,0,0.1)); border: 1px solid rgba(255,215,0,0.4); box-shadow: 0 0 8px rgba(255,215,0,0.2); }
        .log-item-boosted { background: linear-gradient(90deg, rgba(180,100,255,0.12), rgba(106,13,173,0.08)); border: 1px solid rgba(180,100,255,0.3); }
        @keyframes itemFadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .log-emoji { font-size: 1.3rem; }
        .log-name { flex: 1; font-size: 0.9rem; font-weight: 600; color: #1a3a5c; }
        .log-pts { font-size: 0.85rem; font-weight: 800; }
        .log-boost-badge { font-size: 0.65rem; font-weight: 900; background: linear-gradient(135deg, #4a0080, #6a0dad); color: white; border-radius: 6px; padding: 1px 5px; letter-spacing: 0.05em; }
        .unlocks-section { width: calc(100% - 40px); max-width: 440px; background: rgba(255,255,255,0.85); border-radius: 20px; padding: 14px 20px; margin: 0 20px 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1.5px solid rgba(255,215,0,0.3); }
        .unlocks-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
        .unlock-badge { background: linear-gradient(135deg, #fff8e1, #fff3cd); border: 1px solid rgba(255,215,0,0.5); border-radius: 10px; padding: 5px 12px; font-size: 0.8rem; font-weight: 700; color: #7a5c00; }
        .fishing-footer { width: 100%; text-align: center; padding: 24px 16px 32px; font-size: 0.75rem; color: #556; opacity: 0.7; margin-top: auto; }
        .fishing-footer a { color: #0077b6; text-decoration: none; }
        .fishing-footer a:hover { text-decoration: underline; }
        @keyframes floatBob { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
        .reset-game-btn { width: 100%; max-width: 320px; height: 40px; font-size: 0.82rem; font-weight: 700; font-family: 'Bricolage Grotesque', system-ui, sans-serif; background: transparent; color: #c62828; border: 1.5px solid rgba(198,40,40,0.35); border-radius: 12px; cursor: pointer; transition: background 0.15s, transform 0.15s; letter-spacing: 0.02em; margin-top: 4px; }
        .reset-game-btn:hover { background: rgba(198,40,40,0.08); transform: translateY(-1px); }
        .reset-game-btn:active { transform: scale(0.97); }

        /* === LEGENDARY OVERLAY === */
        .legendary-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; animation: overlayFadeIn 0.3s ease-out both; }
        @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .legendary-popup { position: relative; width: min(90vw, 380px); background: linear-gradient(135deg, #1a0800, #3d2000, #1a0800); border: 3px solid #ffd700; border-radius: 28px; padding: 36px 28px 28px; text-align: center; box-shadow: 0 0 60px rgba(255,215,0,0.8), 0 0 120px rgba(255,165,0,0.4); animation: popupEntry 0.6s cubic-bezier(0.34,1.56,0.64,1) both, popupGlow 1.5s ease-in-out infinite; overflow: visible; }
        @keyframes popupEntry { from { transform: scale(0.5) rotate(-5deg); opacity: 0; } to { transform: scale(1) rotate(0deg); opacity: 1; } }
        @keyframes popupGlow { 0%, 100% { box-shadow: 0 0 60px rgba(255,215,0,0.8), 0 0 120px rgba(255,165,0,0.4); } 50% { box-shadow: 0 0 100px rgba(255,215,0,1), 0 0 180px rgba(255,165,0,0.7); } }
        .legendary-rays { position: absolute; inset: -60px; border-radius: 50%; pointer-events: none; animation: rayRotate 8s linear infinite; z-index: -1; }
        .legendary-rays::before { content: ''; position: absolute; inset: 0; background: conic-gradient(from 0deg, transparent 0deg, rgba(255,215,0,0.15) 10deg, transparent 20deg, transparent 45deg, rgba(255,165,0,0.1) 55deg, transparent 65deg, transparent 90deg, rgba(255,215,0,0.15) 100deg, transparent 110deg, transparent 135deg, rgba(255,165,0,0.1) 145deg, transparent 155deg, transparent 180deg, rgba(255,215,0,0.15) 190deg, transparent 200deg, transparent 225deg, rgba(255,165,0,0.1) 235deg, transparent 245deg, transparent 270deg, rgba(255,215,0,0.15) 280deg, transparent 290deg, transparent 315deg, rgba(255,165,0,0.1) 325deg, transparent 335deg); border-radius: 50%; }
        @keyframes rayRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .legendary-particle { position: absolute; font-size: 1.2rem; pointer-events: none; animation: particleFloat var(--dur, 2s) ease-in-out var(--delay, 0s) infinite; }
        @keyframes particleFloat { 0% { transform: translateY(0px) scale(0.8); opacity: 0.3; } 50% { transform: translateY(-20px) scale(1.3); opacity: 1; } 100% { transform: translateY(-40px) scale(0.6); opacity: 0; } }
        .legendary-fish-emoji { font-size: 5rem; display: block; animation: fishPulse 1s ease-in-out infinite; filter: drop-shadow(0 0 24px rgba(255,215,0,1)); margin-bottom: 8px; }
        @keyframes fishPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        .legendary-title { font-family: 'Bricolage Grotesque', system-ui, sans-serif; font-size: clamp(1.6rem, 6vw, 2.2rem); font-weight: 900; color: #ffd700; text-transform: uppercase; letter-spacing: 0.08em; line-height: 1.1; animation: titleGlow 1s ease-in-out infinite; }
        @keyframes titleGlow { 0%, 100% { text-shadow: 0 0 20px rgba(255,215,0,0.8), 0 2px 4px rgba(0,0,0,0.8); } 50% { text-shadow: 0 0 50px rgba(255,215,0,1), 0 0 80px rgba(255,165,0,0.8), 0 2px 4px rgba(0,0,0,0.8); } }
        .legendary-subtitle { font-size: clamp(0.9rem, 3vw, 1.1rem); font-weight: 700; color: #ffe87a; margin-top: 6px; text-shadow: 0 1px 6px rgba(0,0,0,0.6); line-height: 1.3; }
        .legendary-pts { display: inline-block; margin-top: 16px; font-size: 1.2rem; font-weight: 900; color: #fff; background: linear-gradient(135deg, #b8860b, #ffd700, #b8860b); padding: 6px 28px; border-radius: 999px; text-shadow: 0 1px 2px rgba(0,0,0,0.5); box-shadow: 0 4px 16px rgba(255,215,0,0.6); animation: ptsBounce 0.8s ease-in-out infinite; }
        @keyframes ptsBounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }

        /* === KRAKEN OVERLAY === */
        .kraken-overlay { position: fixed; inset: 0; z-index: 9998; background: rgba(0,0,30,0.88); display: flex; align-items: center; justify-content: center; animation: overlayFadeIn 0.4s ease-out both; }
        .kraken-popup { position: relative; width: min(92vw, 400px); background: linear-gradient(160deg, #0d001a, #1a003a, #0d0028); border: 2.5px solid #7b2fff; border-radius: 28px; padding: 32px 24px 28px; text-align: center; box-shadow: 0 0 60px rgba(123,47,255,0.6), 0 0 120px rgba(80,0,200,0.3); animation: popupEntry 0.5s cubic-bezier(0.34,1.56,0.64,1) both; overflow: visible; }
        .tentacle { position: absolute; width: 6px; height: 60px; background: linear-gradient(180deg, #7b2fff, #4a0080); border-radius: 3px 3px 8px 8px; transform-origin: top center; animation: tentacleWave 1.4s ease-in-out calc(var(--i) * 0.18s) infinite alternate; }
        .tentacle:nth-child(1) { top: -52px; left: 8%; transform: rotate(-30deg); }
        .tentacle:nth-child(2) { top: -52px; left: 20%; transform: rotate(-15deg); }
        .tentacle:nth-child(3) { top: -52px; left: 35%; transform: rotate(-5deg); }
        .tentacle:nth-child(4) { top: -52px; left: 50%; transform: rotate(5deg); }
        .tentacle:nth-child(5) { top: -52px; left: 62%; transform: rotate(15deg); }
        .tentacle:nth-child(6) { top: -52px; left: 75%; transform: rotate(25deg); }
        .tentacle:nth-child(7) { top: -52px; left: 85%; transform: rotate(35deg); }
        .tentacle:nth-child(8) { top: -52px; left: 93%; transform: rotate(45deg); }
        @keyframes tentacleWave { from { transform: rotate(var(--r, -15deg)) scaleY(0.9); } to { transform: rotate(calc(var(--r, -15deg) + 20deg)) scaleY(1.1); } }
        .kraken-emoji { font-size: 4.5rem; display: block; margin-bottom: 6px; animation: fishPulse 1.2s ease-in-out infinite; filter: drop-shadow(0 0 20px rgba(123,47,255,0.9)); }
        .kraken-title { font-family: 'Bricolage Grotesque', system-ui, sans-serif; font-size: clamp(1.3rem, 5vw, 1.8rem); font-weight: 900; color: #c77dff; text-transform: uppercase; letter-spacing: 0.06em; line-height: 1.1; text-shadow: 0 0 20px rgba(123,47,255,0.8); animation: krakenGlow 1.2s ease-in-out infinite; }
        @keyframes krakenGlow { 0%, 100% { text-shadow: 0 0 20px rgba(123,47,255,0.8); } 50% { text-shadow: 0 0 40px rgba(180,100,255,1), 0 0 60px rgba(123,47,255,0.5); } }
        .kraken-sub { font-size: 0.95rem; font-weight: 600; color: #b39ddb; margin-top: 8px; margin-bottom: 16px; }
        .kraken-shield-notice { background: rgba(26,35,126,0.3); border: 1px solid rgba(100,120,255,0.4); border-radius: 10px; padding: 7px 14px; font-size: 0.8rem; font-weight: 700; color: #90caf9; margin-bottom: 12px; }
        .kraken-pts-row { display: flex; justify-content: center; align-items: center; gap: 10px; background: rgba(123,47,255,0.15); border: 1px solid rgba(123,47,255,0.3); border-radius: 12px; padding: 10px 20px; margin-bottom: 18px; }
        .kraken-pts-label { font-size: 0.9rem; font-weight: 600; color: #ce93d8; }
        .kraken-pts-value { font-size: 1.8rem; font-weight: 900; color: #fff; text-shadow: 0 0 12px rgba(200,150,255,0.8); }
        .kraken-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .kraken-btn { flex: 1; min-width: 130px; max-width: 180px; padding: 14px 12px; font-size: 0.95rem; font-weight: 800; border: none; border-radius: 16px; cursor: pointer; font-family: 'Bricolage Grotesque', system-ui, sans-serif; letter-spacing: 0.04em; transition: transform 0.15s; }
        .kraken-btn:active { transform: scale(0.95); }
        .lock-btn { background: linear-gradient(135deg, #1b5e20, #2e7d32); color: white; box-shadow: 0 4px 16px rgba(27,94,32,0.5); }
        .lock-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(27,94,32,0.6); }
        .risk-btn { background: linear-gradient(135deg, #b71c1c, #c62828); color: white; box-shadow: 0 4px 16px rgba(183,28,28,0.5); animation: alertPulse 0.8s ease-in-out infinite; }
        .kraken-banked-row { margin-top: 14px; font-size: 0.8rem; color: #9575cd; }
        .kraken-banked-row strong { color: #b39ddb; }
        .outcome-popup { }
        .outcome-win { border-color: #ffd700; background: linear-gradient(160deg, #0d1a00, #1a3300, #0d1800); box-shadow: 0 0 60px rgba(255,215,0,0.6); }
        .outcome-lose { border-color: #b71c1c; background: linear-gradient(160deg, #1a0000, #330000, #1a0000); box-shadow: 0 0 60px rgba(183,28,28,0.6); }
        .outcome-emoji { font-size: 4rem; display: block; margin-bottom: 10px; animation: fishPulse 0.8s ease-in-out infinite; }
        .outcome-title { font-family: 'Bricolage Grotesque', system-ui, sans-serif; font-size: clamp(1.1rem, 4.5vw, 1.5rem); font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; line-height: 1.2; }
        .outcome-win .outcome-title { color: #ffd700; text-shadow: 0 0 20px rgba(255,215,0,0.8); }
        .outcome-lose .outcome-title { color: #ef5350; text-shadow: 0 0 20px rgba(239,83,80,0.8); }
        .outcome-sub { margin-top: 10px; font-size: 0.95rem; font-weight: 600; color: #ccc; }

        /* === HIGH SCORE POPUP === */
        .hs-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; padding: 20px; animation: overlayFadeIn 0.3s ease-out both; }
        .hs-popup { width: min(92vw, 380px); background: linear-gradient(160deg, #0a1628, #122040, #0a1628); border: 2.5px solid #ffd700; border-radius: 28px; padding: 32px 24px 28px; text-align: center; box-shadow: 0 0 60px rgba(255,215,0,0.4); animation: popupEntry 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .hs-emoji { font-size: 3rem; display: block; margin-bottom: 8px; }
        .hs-title { font-family: 'Bricolage Grotesque', system-ui, sans-serif; font-size: clamp(1.4rem, 5vw, 1.8rem); font-weight: 900; color: #ffd700; text-transform: uppercase; letter-spacing: 0.06em; text-shadow: 0 0 20px rgba(255,215,0,0.8); }
        .hs-sub { font-size: 0.9rem; font-weight: 600; color: #90a4ae; margin: 8px 0 16px; }
        .hs-score-display { display: flex; flex-direction: column; align-items: center; background: rgba(255,215,0,0.1); border: 1px solid rgba(255,215,0,0.3); border-radius: 14px; padding: 12px 24px; margin-bottom: 18px; }
        .hs-score-num { font-size: 2.4rem; font-weight: 900; color: #ffd700; line-height: 1; }
        .hs-score-label { font-size: 0.75rem; font-weight: 600; color: #90a4ae; text-transform: uppercase; letter-spacing: 0.1em; }
        .hs-name-row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
        .hs-name-label { font-size: 0.8rem; font-weight: 700; color: #90a4ae; text-align: left; }
        .hs-name-input { width: 100%; background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 10px 14px; font-size: 0.95rem; font-weight: 600; color: white; font-family: inherit; outline: none; }
        .hs-name-input:focus { border-color: rgba(255,215,0,0.5); background: rgba(255,255,255,0.12); }
        .hs-buttons { display: flex; gap: 10px; }
        .hs-btn { flex: 1; padding: 13px 12px; font-size: 0.9rem; font-weight: 800; border: none; border-radius: 14px; cursor: pointer; font-family: 'Bricolage Grotesque', system-ui, sans-serif; transition: transform 0.15s; letter-spacing: 0.02em; }
        .hs-btn:active { transform: scale(0.95); }
        .hs-submit-btn { background: linear-gradient(135deg, #b8860b, #ffd700); color: #1a0800; box-shadow: 0 4px 16px rgba(255,215,0,0.4); }
        .hs-submit-btn:hover { transform: translateY(-2px); }
        .hs-skip-btn { background: rgba(255,255,255,0.08); color: #90a4ae; border: 1px solid rgba(255,255,255,0.15); }
        .hs-skip-btn:hover { background: rgba(255,255,255,0.14); }

        /* === RESET MODAL === */
        .reset-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; padding: 20px; animation: overlayFadeIn 0.25s ease-out both; }
        .reset-popup { width: min(92vw, 360px); background: linear-gradient(160deg, #1a0505, #2a0a0a, #1a0505); border: 2px solid rgba(198,40,40,0.5); border-radius: 24px; padding: 28px 22px 24px; text-align: center; box-shadow: 0 0 40px rgba(198,40,40,0.3); animation: popupEntry 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        .reset-title { font-family: 'Bricolage Grotesque', system-ui, sans-serif; font-size: 1.4rem; font-weight: 900; color: #ef5350; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
        .reset-msg { font-size: 0.9rem; font-weight: 600; color: #b0bec5; margin-bottom: 6px; }
        .reset-msg-safe { font-size: 0.8rem; color: #81c784; margin-bottom: 20px; }
        .reset-buttons { display: flex; gap: 10px; justify-content: center; }
        .reset-btn { flex: 1; max-width: 150px; padding: 13px 12px; font-size: 0.9rem; font-weight: 800; border: none; border-radius: 14px; cursor: pointer; font-family: 'Bricolage Grotesque', system-ui, sans-serif; transition: transform 0.15s; letter-spacing: 0.02em; }
        .reset-btn:active { transform: scale(0.95); }
        .reset-cancel-btn { background: rgba(255,255,255,0.08); color: #b0bec5; border: 1px solid rgba(255,255,255,0.15); }
        .reset-cancel-btn:hover { background: rgba(255,255,255,0.14); }
        .reset-confirm-btn { background: linear-gradient(135deg, #b71c1c, #c62828); color: white; box-shadow: 0 4px 14px rgba(183,28,28,0.5); }
        .reset-confirm-btn:hover { transform: translateY(-2px); }

        /* === UNLOCK TOAST === */
        .unlock-toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #b8860b, #ffd700); color: #1a0800; font-size: 0.9rem; font-weight: 800; padding: 12px 22px; border-radius: 999px; box-shadow: 0 6px 24px rgba(255,215,0,0.5); z-index: 9997; animation: toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; white-space: nowrap; max-width: 90vw; text-align: center; }
        @keyframes toastIn { from { transform: translateX(-50%) translateY(20px) scale(0.9); opacity: 0; } to { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; } }

        /* === SHIELD DISPLAY === */
        .shield-display { background: linear-gradient(135deg, #1a237e, #283593); color: white; border-radius: 14px; padding: 5px 12px; font-size: 0.9rem; font-weight: 800; box-shadow: 0 4px 12px rgba(26,35,126,0.4); }

        /* === AD BUTTONS === */
        .ad-btn-wrapper { width: 100%; max-width: 320px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .ad-reward-btn { position: relative; width: 100%; height: 44px; font-size: 0.9rem; font-weight: 800; font-family: 'Bricolage Grotesque', system-ui, sans-serif; background: linear-gradient(135deg, #4a0080, #6a0dad); color: white; border: none; border-radius: 14px; cursor: pointer; box-shadow: 0 4px 14px rgba(106,13,173,0.4); transition: transform 0.15s, opacity 0.15s; letter-spacing: 0.02em; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 0 16px; }
        .ad-reward-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 7px 18px rgba(106,13,173,0.5); }
        .ad-reward-btn:active:not(:disabled) { transform: scale(0.96); }
        .ad-reward-btn:disabled { opacity: 0.5; cursor: default; }
        .ad-badge { background: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.4); border-radius: 4px; padding: 1px 5px; font-size: 0.62rem; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; flex-shrink: 0; }
        .ad-btn-sub { font-size: 0.72rem; color: #6a0dad; font-weight: 600; text-align: center; }

        /* === KRAKEN RECOVERY POPUP === */
        .overlay { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; animation: overlayFadeIn 0.3s ease-out both; }
        .kraken-recovery-overlay { background: rgba(0,0,10,0.85); }
        .recovery-popup { width: min(92vw, 380px); background: linear-gradient(160deg, #1a0030, #2a0050, #1a0030); border: 2.5px solid #7b2fff; border-radius: 28px; padding: 32px 24px 28px; text-align: center; box-shadow: 0 0 60px rgba(123,47,255,0.5); animation: popupEntry 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .recovery-title { font-family: 'Bricolage Grotesque', system-ui, sans-serif; font-size: clamp(1.2rem, 5vw, 1.6rem); font-weight: 900; color: #e040fb; text-transform: uppercase; letter-spacing: 0.05em; margin: 10px 0 8px; line-height: 1.2; }
        .recovery-msg { font-size: 0.95rem; color: #ce93d8; font-weight: 600; margin-bottom: 12px; }
        .recovery-pts { background: rgba(123,47,255,0.2); border: 1px solid rgba(123,47,255,0.4); border-radius: 10px; padding: 8px 16px; font-size: 1.1rem; font-weight: 900; color: #fff; margin-bottom: 20px; display: inline-block; }
        .recovery-buttons { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .recovery-btn { flex: 1; min-width: 120px; max-width: 170px; padding: 13px 10px; font-size: 0.9rem; font-weight: 800; border: none; border-radius: 14px; cursor: pointer; font-family: 'Bricolage Grotesque', system-ui, sans-serif; transition: transform 0.15s; display: flex; align-items: center; justify-content: center; gap: 6px; letter-spacing: 0.02em; }
        .recovery-btn:active { transform: scale(0.95); }
        .recovery-no-btn { background: rgba(255,255,255,0.1); color: #ce93d8; border: 1.5px solid rgba(255,255,255,0.2); }
        .recovery-no-btn:hover { background: rgba(255,255,255,0.18); }
        .recovery-yes-btn { background: linear-gradient(135deg, #4a0080, #6a0dad); color: white; box-shadow: 0 4px 14px rgba(106,13,173,0.5); }
        .recovery-yes-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(106,13,173,0.6); }

        /* === AD WATCHING MODAL === */
        .ad-watching-overlay { background: rgba(0,0,0,0.9); z-index: 10000; }
        .ad-watching-popup { width: min(92vw, 340px); background: #1a1a2e; border: 2px solid rgba(255,255,255,0.15); border-radius: 24px; padding: 36px 28px 28px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.6); animation: popupEntry 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
        .ad-watching-label { font-size: 0.8rem; font-weight: 700; color: #90a4ae; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }
        .ad-watching-countdown { font-size: 4rem; font-weight: 900; color: #fff; line-height: 1; margin-bottom: 12px; font-family: 'Bricolage Grotesque', system-ui, sans-serif; }
        .ad-countdown-bar { width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 999px; overflow: hidden; margin-bottom: 14px; }
        .ad-countdown-fill { height: 100%; background: linear-gradient(90deg, #6a0dad, #e040fb); border-radius: 999px; transition: width 1s linear; }
        .ad-watching-msg { font-size: 0.85rem; color: #78909c; font-weight: 600; margin-bottom: 20px; }
        .ad-skip-btn { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #78909c; border-radius: 10px; padding: 8px 20px; font-size: 0.8rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .ad-skip-btn:hover { background: rgba(255,255,255,0.08); color: #b0bec5; }

        /* === AD TOAST === */
        .ad-toast { position: fixed; bottom: 120px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #4a0080, #6a0dad); color: white; font-size: 0.9rem; font-weight: 800; padding: 12px 22px; border-radius: 999px; box-shadow: 0 6px 24px rgba(106,13,173,0.5); z-index: 9997; animation: toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; white-space: nowrap; max-width: 90vw; text-align: center; }
      `}</style>
      <GameButtonsPanel />
      <GameBottomNav />
      <FloatingBoostButton />
    </div>
  );
}
