import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { type LeaderboardEntry, getLeaderboard } from "../lib/leaderboard";

const RANK_MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries(getLeaderboard());
  }, []);

  return (
    <div className="lb-root">
      <div className="lb-container">
        <button
          type="button"
          className="lb-back-btn"
          onClick={() => navigate({ to: "/fishing" })}
          data-ocid="leaderboard.back_button"
        >
          ← Back to Fishing
        </button>

        <div className="lb-header">
          <div className="lb-title">🏆 Florida Dave Pier Leaderboard</div>
          <div className="lb-subtitle">
            Top 10 Pier Legends — Ranked by Banked Points
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="lb-empty" data-ocid="leaderboard.empty_state">
            <div className="lb-empty-icon">🎣</div>
            <div className="lb-empty-text">
              No scores yet. Be the first pier legend!
            </div>
          </div>
        ) : (
          <div className="lb-list" data-ocid="leaderboard.list">
            {entries.map((entry, idx) => {
              const rank = idx + 1;
              const medal = RANK_MEDAL[rank] || null;
              const isFirst = rank === 1;
              const isTop3 = rank <= 3;
              return (
                <div
                  key={`${entry.name}-${rank}`}
                  className={`lb-entry lb-rank-${Math.min(rank, 4)}`}
                  data-ocid={`leaderboard.item.${rank}`}
                >
                  <div className={`lb-rank-num ${isFirst ? "lb-rank-1" : ""}`}>
                    {medal ? <span className="lb-medal">{medal}</span> : null}
                    <span className="lb-num">#{rank}</span>
                  </div>
                  <div className="lb-player-info">
                    <div
                      className={`lb-name ${isFirst ? "lb-name-first" : isTop3 ? "lb-name-top3" : ""}`}
                    >
                      {entry.name}
                    </div>
                    <div className="lb-date">{entry.date}</div>
                  </div>
                  <div
                    className={`lb-score ${isFirst ? "lb-score-first" : isTop3 ? "lb-score-top3" : ""}`}
                  >
                    {entry.score.toLocaleString()}
                    <span className="lb-pts-label">pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="lb-footer-note">
          🌊 Scores based on banked points only
        </div>
      </div>

      <footer className="lb-footer">
        © {new Date().getFullYear()}{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Built with love using caffeine.ai
        </a>
      </footer>

      <style>{`
        .lb-root {
          min-height: 100vh;
          background: linear-gradient(180deg, #87ceeb 0%, #b0e0e8 30%, #e0f4f8 50%);
          font-family: 'Outfit', 'Bricolage Grotesque', system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow-x: hidden;
          padding-bottom: 32px;
        }
        .lb-container {
          width: 100%;
          max-width: 480px;
          padding: 20px 20px 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .lb-back-btn {
          align-self: flex-start;
          background: rgba(0,119,182,0.1);
          border: 1.5px solid rgba(0,119,182,0.3);
          color: #0077b6;
          font-size: 0.9rem;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 12px;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s;
        }
        .lb-back-btn:hover { background: rgba(0,119,182,0.18); }
        .lb-header {
          text-align: center;
          padding: 12px 0 4px;
        }
        .lb-title {
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
          font-size: clamp(1.4rem, 5vw, 1.9rem);
          font-weight: 900;
          color: #0a2a4a;
          text-shadow: 0 2px 4px rgba(255,255,255,0.7);
          line-height: 1.2;
        }
        .lb-subtitle {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1a5a8c;
          margin-top: 6px;
          opacity: 0.8;
        }
        .lb-empty {
          text-align: center;
          padding: 48px 24px;
          background: rgba(255,255,255,0.85);
          border-radius: 20px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .lb-empty-icon { font-size: 3.5rem; margin-bottom: 12px; }
        .lb-empty-text { font-size: 1rem; font-weight: 600; color: #1a5a8c; }
        .lb-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .lb-entry {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255,255,255,0.9);
          border-radius: 16px;
          padding: 14px 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border: 1.5px solid rgba(0,119,182,0.1);
          transition: transform 0.15s;
        }
        .lb-entry:hover { transform: translateY(-1px); }
        /* Rank 1 - gold */
        .lb-rank-1 {
          background: linear-gradient(135deg, #fffde7, #fff8e1, #fffde7);
          border: 2.5px solid #ffd700;
          box-shadow: 0 6px 24px rgba(255,215,0,0.4), 0 0 0 1px rgba(255,215,0,0.2);
          padding: 18px 16px;
        }
        /* Rank 2 - silver */
        .lb-rank-2 {
          background: linear-gradient(135deg, #f5f5f5, #fafafa, #f5f5f5);
          border: 2px solid #b0b0b0;
          box-shadow: 0 4px 16px rgba(150,150,150,0.3);
        }
        /* Rank 3 - bronze */
        .lb-rank-3 {
          background: linear-gradient(135deg, #fef3e2, #fdebd0, #fef3e2);
          border: 2px solid #cd7f32;
          box-shadow: 0 4px 16px rgba(205,127,50,0.3);
        }
        .lb-rank-num {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 40px;
          gap: 2px;
        }
        .lb-medal { font-size: 1.5rem; line-height: 1; }
        .lb-rank-1 .lb-medal { font-size: 2rem; }
        .lb-num {
          font-size: 0.75rem;
          font-weight: 800;
          color: #0a4a7c;
          opacity: 0.7;
        }
        .lb-rank-1 .lb-num { font-size: 0.85rem; opacity: 0.9; }
        .lb-player-info {
          flex: 1;
          min-width: 0;
        }
        .lb-name {
          font-size: 1rem;
          font-weight: 700;
          color: #1a3a5c;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lb-name-first {
          font-size: 1.2rem;
          font-weight: 900;
          color: #7a5c00;
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        }
        .lb-name-top3 { font-weight: 800; color: #0a2a4a; }
        .lb-date {
          font-size: 0.72rem;
          color: #888;
          margin-top: 2px;
        }
        .lb-score {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          flex-shrink: 0;
        }
        .lb-score {
          font-size: 1.3rem;
          font-weight: 900;
          color: #0077b6;
        }
        .lb-score-first {
          font-size: 1.6rem;
          color: #b8860b;
          text-shadow: 0 0 8px rgba(255,215,0,0.5);
        }
        .lb-score-top3 { font-size: 1.4rem; color: #0a4a7c; }
        .lb-pts-label {
          font-size: 0.65rem;
          font-weight: 600;
          opacity: 0.65;
          margin-left: 2px;
          display: block;
          text-align: right;
        }
        .lb-footer-note {
          text-align: center;
          font-size: 0.78rem;
          color: #1a5a8c;
          opacity: 0.65;
          padding: 4px 0 8px;
        }
        .lb-footer {
          width: 100%;
          text-align: center;
          padding: 24px 16px 32px;
          font-size: 0.75rem;
          color: #556;
          opacity: 0.7;
          margin-top: auto;
        }
        .lb-footer a { color: #0077b6; text-decoration: none; }
        .lb-footer a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
