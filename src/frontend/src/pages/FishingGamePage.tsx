import { useCallback, useEffect, useRef, useState } from "react";

type GameState =
  | "idle"
  | "casting"
  | "waiting"
  | "biting"
  | "reeled"
  | "missed";

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
  // 1 in 500 chance for the legendary Golden Florida Dave Fish
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

interface CatchEntry {
  id: number;
  catch: Catch;
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

export default function FishingGamePage() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [lastCatch, setLastCatch] = useState<Catch | null>(null);
  const [catchLog, setCatchLog] = useState<CatchEntry[]>([]);
  const [reelCountdown, setReelCountdown] = useState(3);
  const [bobberLeft, setBobberLeft] = useState(50);
  const [showCastLine, setShowCastLine] = useState(false);
  const [showLegendaryPopup, setShowLegendaryPopup] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const catchRef = useRef<Catch | null>(null);
  const catchIdRef = useRef(0);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

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
      // Show legendary popup for 3 seconds, then reveal catch card + score
      setShowLegendaryPopup(true);
      timerRef.current = setTimeout(() => {
        setShowLegendaryPopup(false);
        setScore((s) => s + caught.points);
        catchIdRef.current += 1;
        setCatchLog((log) => [
          { id: catchIdRef.current, catch: caught },
          ...log.slice(0, 4),
        ]);
        setLastCatch(caught);
        setGameState("reeled");
        timerRef.current = setTimeout(() => {
          setLastCatch(null);
          setGameState("idle");
        }, 3500);
      }, 3000);
    } else {
      setLastCatch(caught);
      setScore((s) => s + caught.points);
      catchIdRef.current += 1;
      setCatchLog((log) => [
        { id: catchIdRef.current, catch: caught },
        ...log.slice(0, 4),
      ]);
      setGameState("reeled");
      timerRef.current = setTimeout(() => {
        setLastCatch(null);
        setGameState("idle");
      }, 3500);
    }
  }

  const reelProgress = (reelCountdown / 3) * 100;

  return (
    <div className="fishing-game-root">
      <header className="fishing-header">
        <div className="fishing-title">🎣 Florida Dave's Pier Fishing</div>
        <div className="fishing-score" data-ocid="fishing.score_display">
          <span className="score-label">Score</span>
          <span className="score-value">{score}</span>
        </div>
      </header>

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
          <button
            type="button"
            className="cast-button"
            onClick={handleCast}
            data-ocid="fishing.cast_button"
          >
            🎣 Cast Line!
          </button>
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
                className={`log-item${
                  entry.catch.rarity === "godlike" ? " log-item-golden" : ""
                }`}
                data-ocid={`fishing.catch_log.item.${idx + 1}`}
              >
                <span className="log-emoji">{entry.catch.emoji}</span>
                <span className="log-name">{entry.catch.name}</span>
                <span
                  className="log-pts"
                  style={{ color: RARITY_COLOR[entry.catch.rarity] }}
                >
                  +{entry.catch.points}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

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
        }
        .fishing-title {
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
          font-size: clamp(1rem, 4vw, 1.3rem);
          font-weight: 800;
          color: #0a4a7c;
          text-shadow: 0 1px 2px rgba(255,255,255,0.8);
          line-height: 1.2;
        }
        .fishing-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(135deg, #0077b6, #0096c7);
          color: white;
          border-radius: 16px;
          padding: 6px 16px;
          min-width: 64px;
          box-shadow: 0 4px 12px rgba(0,119,182,0.4);
          flex-shrink: 0;
        }
        .score-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          opacity: 0.85;
        }
        .score-value {
          font-size: 1.4rem;
          font-weight: 800;
          line-height: 1;
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
        .sun {
          position: absolute;
          top: 10px;
          right: 20px;
          font-size: 2.2rem;
          animation: floatBob 4s ease-in-out infinite;
          filter: drop-shadow(0 0 12px rgba(255,215,0,0.8));
        }
        .cloud {
          position: absolute;
          font-size: 1.8rem;
          animation: drift 20s linear infinite;
          opacity: 0.9;
        }
        .cloud-1 { top: 18px; left: -60px; animation-duration: 25s; }
        .cloud-2 { top: 30px; left: -80px; animation-duration: 35s; animation-delay: -12s; font-size: 1.4rem; }
        @keyframes drift {
          from { transform: translateX(-40px); }
          to { transform: translateX(520px); }
        }
        .pier {
          position: absolute;
          bottom: 38%;
          left: 0; right: 0;
          height: 52px;
          background: repeating-linear-gradient(
            90deg,
            #8B5E3C 0px, #8B5E3C 44px,
            #6b4423 44px, #6b4423 48px
          );
          border-top: 3px solid #a0714a;
          border-bottom: 2px solid #5c3a1a;
        }
        .plank {
          position: absolute;
          top: 4px; bottom: 4px;
          width: 3px;
          background: rgba(0,0,0,0.15);
        }
        .plank:nth-child(1) { left: 12%; }
        .plank:nth-child(2) { left: 24%; }
        .plank:nth-child(3) { left: 38%; }
        .plank:nth-child(4) { left: 52%; }
        .plank:nth-child(5) { left: 68%; }
        .plank:nth-child(6) { left: 82%; }
        .pier-post {
          position: absolute;
          bottom: -28px;
          width: 14px;
          height: 32px;
          background: linear-gradient(180deg, #6b4423, #4a2e12);
          border-radius: 2px 2px 0 0;
        }
        .left-post { left: 20%; }
        .right-post { right: 20%; }
        .fishing-rod {
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 30px;
        }
        .rod-body {
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #d4a843, #8B5E3C);
          border-radius: 2px;
          transform: rotate(20deg);
          transform-origin: bottom center;
        }
        .fishing-line {
          position: absolute;
          top: 100%;
          width: 1.5px;
          height: 120px;
          background: rgba(220, 220, 220, 0.85);
          transform: translateX(-50%);
          transform-origin: top center;
          animation: lineSwing 0.7s ease-out;
        }
        @keyframes lineSwing {
          from { transform: translateX(-50%) scaleY(0); }
          to { transform: translateX(-50%) scaleY(1); }
        }
        .water-layer {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 42%;
          background: linear-gradient(180deg, #0096c7 0%, #0077b6 40%, #023e8a 100%);
          overflow: hidden;
        }
        .wave {
          position: absolute;
          top: 0; left: -50%;
          width: 200%;
          height: 20px;
          background: rgba(144, 224, 239, 0.3);
          border-radius: 50%;
          animation: waveRoll 4s linear infinite;
        }
        .wave-2 {
          top: 8px;
          animation-duration: 5s;
          animation-delay: -2s;
          opacity: 0.5;
        }
        @keyframes waveRoll {
          from { transform: translateX(0); }
          to { transform: translateX(25%); }
        }
        .water-shimmer {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent 0px,
            rgba(255,255,255,0.04) 4px,
            transparent 8px
          );
          animation: shimmerMove 3s linear infinite;
        }
        @keyframes shimmerMove {
          from { background-position: 0 0; }
          to { background-position: 40px 0; }
        }
        .bobber-container {
          position: absolute;
          top: 6px;
          width: 20px;
          height: 22px;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .bobber-top {
          width: 16px;
          height: 11px;
          background: radial-gradient(circle at 40% 35%, #ff6b6b, #cc0000);
          border-radius: 50% 50% 0 0;
          border: 1.5px solid rgba(0,0,0,0.2);
        }
        .bobber-bottom {
          width: 16px;
          height: 11px;
          background: radial-gradient(circle at 40% 35%, #ffffff, #d0d0d0);
          border-radius: 0 0 50% 50%;
          border: 1.5px solid rgba(0,0,0,0.2);
          border-top: none;
        }
        .bobber-container.bobbing { animation: bobberFloat 1.2s ease-in-out infinite; }
        .bobber-container.biting { animation: bobberBite 0.3s ease-in-out infinite; }
        .bobber-container.casting { animation: bobberDrop 0.6s ease-out forwards; }
        @keyframes bobberFloat {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50% { transform: translateX(-50%) translateY(3px); }
        }
        @keyframes bobberBite {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
        @keyframes bobberDrop {
          from { transform: translateX(-50%) translateY(-60px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0px); opacity: 1; }
        }
        .splash {
          position: absolute;
          top: -4px;
          font-size: 1.4rem;
          transform: translateX(-50%);
          animation: splashAnim 0.4s ease-out infinite;
          pointer-events: none;
        }
        @keyframes splashAnim {
          0% { transform: translateX(-50%) scale(0.8); opacity: 1; }
          100% { transform: translateX(-50%) scale(1.4); opacity: 0.5; }
        }
        .sand-strip {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 0;
          display: flex;
          gap: 20%;
          padding: 0 16px;
          align-items: flex-end;
          pointer-events: none;
        }
        .sand-emoji {
          font-size: 1.1rem;
          animation: floatBob 3s ease-in-out infinite;
          position: relative;
          bottom: 2px;
        }
        /* === ACTION AREA === */
        .action-area {
          width: 100%;
          max-width: 480px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          min-height: 110px;
          justify-content: center;
        }
        .cast-button {
          width: 100%;
          max-width: 320px;
          height: 68px;
          font-size: 1.3rem;
          font-weight: 800;
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
          background: linear-gradient(135deg, #0077b6, #0096c7);
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0, 119, 182, 0.45), 0 2px 6px rgba(0,0,0,0.15);
          transition: transform 0.15s, box-shadow 0.15s;
          letter-spacing: 0.02em;
        }
        .cast-button:active { transform: scale(0.96); box-shadow: 0 3px 10px rgba(0, 119, 182, 0.4); }
        .cast-button:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0, 119, 182, 0.5); }
        .state-message {
          font-size: 1.2rem;
          font-weight: 700;
          text-align: center;
          padding: 16px 24px;
          border-radius: 16px;
        }
        .casting-msg { color: #0077b6; background: rgba(0,119,182,0.1); }
        .waiting-msg { color: #0a4a7c; background: rgba(0,150,199,0.1); }
        .missed-msg { color: #c62828; background: rgba(198,40,40,0.1); animation: shakeMsg 0.4s ease-in-out; }
        .reeled-msg { color: #1b5e20; background: rgba(27,94,32,0.1); }
        @keyframes shakeMsg {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .waiting-dots { margin-right: 2px; }
        .dot-anim {
          display: inline-block;
          animation: dotPulse 1.2s steps(3, end) infinite;
          letter-spacing: 2px;
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .reel-zone {
          width: 100%;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .reel-alert {
          font-size: 1rem;
          font-weight: 800;
          color: #cc0000;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          animation: alertPulse 0.6s ease-in-out infinite;
        }
        @keyframes alertPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        .reel-button {
          width: 100%;
          height: 72px;
          font-size: 1.5rem;
          font-weight: 900;
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
          background: linear-gradient(135deg, #ff6b00, #e63900);
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(230, 57, 0, 0.5), 0 2px 6px rgba(0,0,0,0.15);
          animation: reelPulse 0.5s ease-in-out infinite;
          letter-spacing: 0.05em;
        }
        .reel-button:active { transform: scale(0.95); }
        @keyframes reelPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 6px 20px rgba(230,57,0,0.5); }
          50% { transform: scale(1.04); box-shadow: 0 10px 30px rgba(230,57,0,0.7); }
        }
        .countdown-bar-wrap {
          width: 100%;
          height: 10px;
          background: rgba(0,0,0,0.12);
          border-radius: 999px;
          overflow: hidden;
        }
        .countdown-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff6b00, #ffd700);
          border-radius: 999px;
          transition: width 0.95s linear;
        }
        .countdown-num {
          font-size: 0.9rem;
          font-weight: 700;
          color: #cc4400;
        }
        .catch-card {
          width: calc(100% - 40px);
          max-width: 440px;
          background: white;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08);
          animation: catchSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          border: 2px solid rgba(0,119,182,0.15);
          margin: 0 20px;
        }
        @keyframes catchSlideIn {
          from { transform: translateY(40px) scale(0.85); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .catch-emoji { font-size: 3.5rem; flex-shrink: 0; }
        .catch-info { display: flex; flex-direction: column; gap: 3px; }
        .catch-rarity { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
        .catch-name {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0a2a4a;
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        }
        .catch-desc { font-size: 0.85rem; color: #555; }
        .catch-pts { font-size: 1.1rem; font-weight: 800; color: #0077b6; margin-top: 2px; }
        .catch-log {
          width: calc(100% - 40px);
          max-width: 440px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          border-radius: 20px;
          padding: 16px 20px;
          margin: 8px 20px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          border: 1.5px solid rgba(0,119,182,0.1);
        }
        .log-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #0a4a7c;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 10px;
        }
        .log-empty { font-size: 0.85rem; color: #888; text-align: center; padding: 8px 0; }
        .log-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .log-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 10px;
          background: rgba(0,119,182,0.06);
          border-radius: 10px;
          animation: itemFadeIn 0.3s ease-out;
        }
        .log-item-golden {
          background: linear-gradient(90deg, rgba(255,215,0,0.15), rgba(255,165,0,0.1));
          border: 1px solid rgba(255,215,0,0.4);
          box-shadow: 0 0 8px rgba(255,215,0,0.2);
        }
        @keyframes itemFadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .log-emoji { font-size: 1.3rem; }
        .log-name { flex: 1; font-size: 0.9rem; font-weight: 600; color: #1a3a5c; }
        .log-pts { font-size: 0.85rem; font-weight: 800; }
        .fishing-footer {
          width: 100%;
          text-align: center;
          padding: 24px 16px 32px;
          font-size: 0.75rem;
          color: #556;
          opacity: 0.7;
          margin-top: auto;
        }
        .fishing-footer a { color: #0077b6; text-decoration: none; }
        .fishing-footer a:hover { text-decoration: underline; }
        @keyframes floatBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        /* === LEGENDARY OVERLAY === */
        .legendary-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: overlayFadeIn 0.3s ease-out both;
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .legendary-popup {
          position: relative;
          width: min(90vw, 380px);
          background: linear-gradient(135deg, #1a0800, #3d2000, #1a0800);
          border: 3px solid #ffd700;
          border-radius: 28px;
          padding: 36px 28px 28px;
          text-align: center;
          box-shadow:
            0 0 60px rgba(255, 215, 0, 0.8),
            0 0 120px rgba(255, 165, 0, 0.4),
            inset 0 1px 0 rgba(255,255,255,0.1);
          animation: popupEntry 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both,
                     popupGlow 1.5s ease-in-out infinite;
          overflow: visible;
        }
        @keyframes popupEntry {
          from { transform: scale(0.5) rotate(-5deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes popupGlow {
          0%, 100% { box-shadow: 0 0 60px rgba(255,215,0,0.8), 0 0 120px rgba(255,165,0,0.4); }
          50% { box-shadow: 0 0 100px rgba(255,215,0,1), 0 0 180px rgba(255,165,0,0.7), 0 0 240px rgba(255,100,0,0.3); }
        }
        .legendary-rays {
          position: absolute;
          inset: -60px;
          border-radius: 50%;
          pointer-events: none;
          animation: rayRotate 8s linear infinite;
          z-index: -1;
        }
        .legendary-rays::before {
          content: '';
          position: absolute;
          inset: 0;
          background: conic-gradient(
            from 0deg,
            transparent 0deg, rgba(255,215,0,0.15) 10deg, transparent 20deg,
            transparent 45deg, rgba(255,165,0,0.1) 55deg, transparent 65deg,
            transparent 90deg, rgba(255,215,0,0.15) 100deg, transparent 110deg,
            transparent 135deg, rgba(255,165,0,0.1) 145deg, transparent 155deg,
            transparent 180deg, rgba(255,215,0,0.15) 190deg, transparent 200deg,
            transparent 225deg, rgba(255,165,0,0.1) 235deg, transparent 245deg,
            transparent 270deg, rgba(255,215,0,0.15) 280deg, transparent 290deg,
            transparent 315deg, rgba(255,165,0,0.1) 325deg, transparent 335deg
          );
          border-radius: 50%;
        }
        @keyframes rayRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .legendary-particle {
          position: absolute;
          font-size: 1.2rem;
          pointer-events: none;
          animation: particleFloat var(--dur, 2s) ease-in-out var(--delay, 0s) infinite;
        }
        @keyframes particleFloat {
          0% { transform: translateY(0px) scale(0.8); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.3); opacity: 1; }
          100% { transform: translateY(-40px) scale(0.6); opacity: 0; }
        }
        .legendary-fish-emoji {
          font-size: 5rem;
          display: block;
          animation: fishPulse 1s ease-in-out infinite;
          filter: drop-shadow(0 0 24px rgba(255,215,0,1));
          margin-bottom: 8px;
        }
        @keyframes fishPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .legendary-title {
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
          font-size: clamp(1.6rem, 6vw, 2.2rem);
          font-weight: 900;
          color: #ffd700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          line-height: 1.1;
          animation: titleGlow 1s ease-in-out infinite;
        }
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(255,215,0,0.8), 0 2px 4px rgba(0,0,0,0.8); }
          50% { text-shadow: 0 0 50px rgba(255,215,0,1), 0 0 80px rgba(255,165,0,0.8), 0 2px 4px rgba(0,0,0,0.8); }
        }
        .legendary-subtitle {
          font-size: clamp(0.9rem, 3vw, 1.1rem);
          font-weight: 700;
          color: #ffe87a;
          margin-top: 6px;
          text-shadow: 0 1px 6px rgba(0,0,0,0.6);
          line-height: 1.3;
        }
        .legendary-pts {
          display: inline-block;
          margin-top: 16px;
          font-size: 1.2rem;
          font-weight: 900;
          color: #fff;
          background: linear-gradient(135deg, #b8860b, #ffd700, #b8860b);
          padding: 6px 28px;
          border-radius: 999px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
          box-shadow: 0 4px 16px rgba(255,215,0,0.6);
          animation: ptsBounce 0.8s ease-in-out infinite;
        }
        @keyframes ptsBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
