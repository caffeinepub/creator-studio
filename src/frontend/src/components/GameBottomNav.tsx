import { useState } from "react";

const TABS = [
  { id: "fish", label: "Fish", emoji: "🎣" },
  { id: "shop", label: "Shop", emoji: "🛒" },
  { id: "leaderboard", label: "Leaderboard", emoji: "🏆" },
  { id: "cameo", label: "Cameo", emoji: "🎬" },
];

export function GameBottomNav() {
  const [active, setActive] = useState("fish");

  return (
    <nav
      data-ocid="game_bottom_nav.panel"
      className="fixed bottom-0 left-0 right-0 z-40 flex"
      style={{
        height: "64px",
        background:
          "linear-gradient(180deg, oklch(0.12 0.04 240), oklch(0.10 0.03 245))",
        borderTop: "1.5px solid oklch(0.82 0.18 85 / 0.35)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            type="button"
            key={tab.id}
            data-ocid={`game_nav.${tab.id}.tab`}
            onClick={() => setActive(tab.id)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90"
            style={{
              color: isActive ? "oklch(0.88 0.22 85)" : "oklch(0.55 0.06 230)",
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
              position: "relative",
            }}
          >
            {isActive && (
              <span
                className="absolute top-0 left-1/2"
                style={{
                  transform: "translateX(-50%)",
                  width: "32px",
                  height: "2px",
                  background: "oklch(0.88 0.22 85)",
                  borderRadius: "0 0 4px 4px",
                  boxShadow: "0 0 8px oklch(0.82 0.18 85 / 0.8)",
                }}
              />
            )}
            <span className="text-xl leading-none">{tab.emoji}</span>
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{
                fontSize: "0.6rem",
                textShadow: isActive
                  ? "0 0 10px oklch(0.82 0.18 85 / 0.7)"
                  : "none",
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
