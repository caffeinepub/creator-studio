import { GameBottomNav } from "@/components/GameBottomNav";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface Reward {
  id: string;
  icon: string;
  title: string;
  description: string;
  modalTitle: string;
  modalMessage: string;
}

const REWARDS: Reward[] = [
  {
    id: "double-coins",
    icon: "💰",
    title: "DOUBLE COINS",
    description: "Double your coins instantly",
    modalTitle: "🎥 DOUBLE YOUR COINS!",
    modalMessage:
      "Want to double your coins and support Florida Dave?\n\nOrder a Cameo to unlock this bonus.\nAfter your order, come back and claim your reward.",
  },
  {
    id: "lucky-cast",
    icon: "🍀",
    title: "LUCKY CAST",
    description: "Better chance at rare fish",
    modalTitle: "🍀 LUCKY CAST BOOST!",
    modalMessage:
      "Want a better shot at rare fish?\n\nOrder a Cameo to unlock this fishing boost.\nThen come back and power up your next cast.",
  },
  {
    id: "vip-fisher",
    icon: "👑",
    title: "VIP FISHER",
    description: "Unlock VIP status",
    modalTitle: "👑 BECOME A VIP FISHER!",
    modalMessage:
      "Unlock a special Florida Dave bonus and fish like a legend.\n\nOrder a Cameo to activate VIP status.\nCome back after your order to claim it.",
  },
  {
    id: "rare-fish-boost",
    icon: "🐟",
    title: "RARE FISH BOOST",
    description: "Increased rare fish odds",
    modalTitle: "🐟 HUNT LEGENDARY FISH!",
    modalMessage:
      "Want a better chance at rare catches?\n\nOrder a Cameo to unlock this special boost.\nThen return and activate your rare fish bonus.",
  },
  {
    id: "coin-rush",
    icon: "💸",
    title: "COIN RUSH",
    description: "Earn coins faster",
    modalTitle: "💰 COIN RUSH ACTIVATED!",
    modalMessage:
      "Ready to stack coins faster?\n\nOrder a Cameo to unlock this reward.\nCome back after your order and cash in.",
  },
  {
    id: "mystery-bonus",
    icon: "🎁",
    title: "MYSTERY BONUS",
    description: "Unlock a surprise reward",
    modalTitle: "🎁 MYSTERY BONUS!",
    modalMessage:
      "Feeling lucky? This reward unlocks a surprise bonus.\n\nOrder a Cameo to reveal it.\nCome back after your order and see what you got.",
  },
];

function RewardModal({
  reward,
  onClose,
}: {
  reward: Reward;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)" }}
        onClick={onClose}
        data-ocid="pier_rewards.modal"
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="relative w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.16 0.06 245), oklch(0.12 0.04 240))",
            border: "2px solid oklch(0.82 0.18 85 / 0.7)",
            boxShadow:
              "0 0 32px oklch(0.82 0.18 85 / 0.35), 0 8px 40px rgba(0,0,0,0.6)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close X */}
          <button
            type="button"
            onClick={onClose}
            data-ocid="pier_rewards.close_button"
            className="absolute top-3 right-4 text-2xl leading-none opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "oklch(0.88 0.22 85)" }}
          >
            ×
          </button>

          {/* Title */}
          <h2
            className="text-xl font-black text-center tracking-wide leading-tight"
            style={{
              color: "oklch(0.90 0.22 85)",
              textShadow: "0 0 20px oklch(0.82 0.18 85 / 0.6)",
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            }}
          >
            {reward.modalTitle}
          </h2>

          {/* Divider */}
          <div
            className="h-px w-full"
            style={{ background: "oklch(0.82 0.18 85 / 0.3)" }}
          />

          {/* Message */}
          <p
            className="text-center text-sm leading-relaxed whitespace-pre-line"
            style={{
              color: "oklch(0.88 0.04 230)",
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            }}
          >
            {reward.modalMessage}
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-1">
            <a
              href="https://www.cameo.com/fortnitebuster"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="pier_rewards.primary_button"
              className="w-full py-4 rounded-xl text-center font-black text-base tracking-widest uppercase transition-all active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.82 0.18 85), oklch(0.75 0.20 75))",
                color: "oklch(0.15 0.04 240)",
                boxShadow:
                  "0 0 18px oklch(0.82 0.18 85 / 0.5), 0 4px 12px rgba(0,0,0,0.3)",
                fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                letterSpacing: "0.08em",
              }}
            >
              GET CAMEO 🎥
            </a>
            <button
              type="button"
              onClick={onClose}
              data-ocid="pier_rewards.cancel_button"
              className="w-full py-3 rounded-xl text-center font-bold text-sm tracking-wider uppercase transition-all active:scale-95"
              style={{
                background: "transparent",
                border: "1.5px solid oklch(0.88 0.04 230 / 0.35)",
                color: "oklch(0.75 0.04 230)",
                fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
              }}
            >
              MAYBE LATER
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function PierRewardsPage() {
  const [activeReward, setActiveReward] = useState<Reward | null>(null);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.10 0.04 245) 0%, oklch(0.08 0.03 240) 100%)",
        fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
        paddingBottom: "80px",
      }}
      data-ocid="pier_rewards.page"
    >
      {/* Header */}
      <header className="pt-10 pb-6 px-5 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-black tracking-widest uppercase mb-2"
          style={{
            color: "oklch(0.90 0.22 85)",
            textShadow:
              "0 0 30px oklch(0.82 0.18 85 / 0.55), 0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          🎣 PIER REWARDS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-sm tracking-wide"
          style={{ color: "oklch(0.80 0.04 230)" }}
        >
          Support Florida Dave &amp; unlock powerful boosts!
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="text-xs font-bold tracking-wider mt-2"
          style={{
            color: "oklch(0.85 0.18 85)",
            textShadow: "0 0 8px oklch(0.82 0.18 85 / 0.5)",
          }}
        >
          ⚡ Limited-time boosts — don't miss out!
        </motion.p>
      </header>

      {/* Reward Cards */}
      <main className="flex-1 px-4 flex flex-col gap-4 max-w-lg mx-auto w-full">
        {REWARDS.map((reward, i) => (
          <motion.button
            key={reward.id}
            type="button"
            data-ocid={`pier_rewards.item.${i + 1}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.07 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveReward(reward)}
            className="w-full text-left rounded-2xl p-5 flex items-center gap-4 transition-all cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.16 0.06 245), oklch(0.13 0.04 240))",
              border: "1.5px solid oklch(0.82 0.18 85 / 0.45)",
              boxShadow:
                "0 0 12px oklch(0.82 0.18 85 / 0.2), 0 2px 8px rgba(0,0,0,0.4)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 20px oklch(0.82 0.18 85 / 0.45), 0 4px 16px rgba(0,0,0,0.5)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "oklch(0.82 0.18 85 / 0.75)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 12px oklch(0.82 0.18 85 / 0.2), 0 2px 8px rgba(0,0,0,0.4)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "oklch(0.82 0.18 85 / 0.45)";
            }}
          >
            {/* Icon */}
            <div
              className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
              style={{
                background: "oklch(0.20 0.08 245)",
                border: "1px solid oklch(0.82 0.18 85 / 0.3)",
                boxShadow: "inset 0 1px 0 oklch(0.82 0.18 85 / 0.15)",
              }}
            >
              {reward.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div
                className="font-black text-base tracking-widest uppercase leading-none mb-1"
                style={{
                  color: "oklch(0.90 0.22 85)",
                  textShadow: "0 0 10px oklch(0.82 0.18 85 / 0.4)",
                }}
              >
                {reward.title}
              </div>
              <div
                className="text-xs leading-snug"
                style={{ color: "oklch(0.72 0.04 230)" }}
              >
                {reward.description}
              </div>
            </div>

            {/* Arrow */}
            <div
              className="flex-shrink-0 text-lg"
              style={{ color: "oklch(0.82 0.18 85 / 0.7)" }}
            >
              ›
            </div>
          </motion.button>
        ))}
      </main>

      {/* Branding footer */}
      <footer className="text-center py-4 px-4">
        <p className="text-xs" style={{ color: "oklch(0.45 0.04 240)" }}>
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </footer>

      {/* Modal */}
      {activeReward && (
        <RewardModal
          reward={activeReward}
          onClose={() => setActiveReward(null)}
        />
      )}

      <GameBottomNav />
    </div>
  );
}
