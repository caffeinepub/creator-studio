export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

const KEY = "fdpier_leaderboard_v1";
const PERSONAL_KEY = "fdpier_personal_best_v1";
const RANDOM_NAMES = [
  "FishMaster",
  "PierLegend",
  "KrakenHunter",
  "TarponKing",
  "CoconutCaster",
  "BaitBoss",
  "SunsetAngler",
  "ReelDeal",
  "PierPatrol",
  "DaveFanatic",
];

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function submitScore(name: string, score: number): LeaderboardEntry[] {
  const entries = getLeaderboard();
  const existingIdx = entries.findIndex((e) => e.name === name);
  if (existingIdx !== -1) {
    if (score <= entries[existingIdx].score) return entries;
    entries[existingIdx] = {
      name,
      score,
      date: new Date().toLocaleDateString(),
    };
  } else {
    entries.push({ name, score, date: new Date().toLocaleDateString() });
  }
  const sorted = entries.sort((a, b) => b.score - a.score).slice(0, 10);
  saveLeaderboard(sorted);
  return sorted;
}

export function getPersonalBest(): number {
  return Number.parseInt(localStorage.getItem(PERSONAL_KEY) || "0", 10);
}

export function setPersonalBest(score: number): void {
  localStorage.setItem(PERSONAL_KEY, String(score));
}

export function getRandomName(): string {
  return RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
}
