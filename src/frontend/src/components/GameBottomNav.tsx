import { useNavigate, useRouterState } from "@tanstack/react-router";

const TABS = [
  { id: "fish", label: "Fish", emoji: "🎣", path: "/fishing" },
  { id: "shop", label: "Shop", emoji: "🛒", path: "/pier-gear" },
  {
    id: "leaderboard",
    label: "Leaderboard",
    emoji: "🏆",
    path: "/leaderboard",
  },
  { id: "rewards", label: "Rewards", emoji: "🎁", path: "/pier-rewards" },
  {
    id: "cameo",
    label: "Cameo",
    emoji: "🎬",
    path: "https://www.cameo.com/fortnitebuster",
  },
];

export function GameBottomNav() {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const currentPath = location.pathname;

  function handleTab(tab: (typeof TABS)[0]) {
    if (tab.path.startsWith("http")) {
      window.open(tab.path, "_blank", "noopener,noreferrer");
    } else {
      navigate({ to: tab.path });
    }
  }

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
        const isActive = tab.path.startsWith("http")
          ? false
          : currentPath === tab.path;
        return (
          <button
            type="button"
            key={tab.id}
            data-ocid={`game_nav.${tab.id}.tab`}
            onClick={() => handleTab(tab)}
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
