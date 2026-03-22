import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface PopupData {
  title: string;
  message: string;
  emoji: string;
}

function GameDialog({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: PopupData | null;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-sm mx-auto text-center"
        style={{
          background: "linear-gradient(160deg, #0a1628, #0d1f3c, #0a1628)",
          border: "2px solid oklch(0.82 0.18 85 / 0.6)",
          borderRadius: "1.5rem",
          boxShadow: "0 0 60px oklch(0.82 0.18 85 / 0.35)",
        }}
      >
        <DialogHeader>
          <div className="text-4xl mb-2">{data?.emoji}</div>
          <DialogTitle
            style={{
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
              color: "oklch(0.88 0.22 85)",
              textShadow: "0 0 20px oklch(0.82 0.18 85 / 0.8)",
              fontSize: "1.25rem",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {data?.title}
          </DialogTitle>
          <DialogDescription
            style={{
              color: "oklch(0.78 0.08 220)",
              fontSize: "1rem",
              fontWeight: 600,
              lineHeight: 1.6,
              marginTop: "0.5rem",
            }}
          >
            {data?.message}
          </DialogDescription>
        </DialogHeader>
        <button
          type="button"
          data-ocid="game_popup.close_button"
          onClick={onClose}
          className="mt-2 w-full py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.82 0.18 85), oklch(0.72 0.20 78))",
            color: "oklch(0.12 0.02 250)",
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            boxShadow: "0 4px 20px oklch(0.82 0.18 85 / 0.5)",
          }}
        >
          Let&apos;s Go! 🔥
        </button>
      </DialogContent>
    </Dialog>
  );
}

const BUTTONS = [
  {
    id: "legendary-hunt",
    label: "🐟 Legendary Hunt",
    popup: {
      emoji: "🐟",
      title: "Legendary Hunt Activated!",
      message:
        "You're hunting LEGENDS now. The Golden Florida Dave Fish is out there... 1 in 500 chance. You ready for that? 🐟⚡",
    },
    style: {
      background: "linear-gradient(135deg, #0a2540, #0d3b5e)",
      border: "2px solid oklch(0.55 0.18 220 / 0.6)",
      color: "oklch(0.82 0.14 210)",
    },
    fishSwim: true,
  },
  {
    id: "double-coins",
    label: "💰 Double Coins",
    popup: {
      emoji: "💰",
      title: "Double Coins!!",
      message:
        "YO! Florida Dave just doubled the bag! Don't blow it on tourist traps! 💰💰",
    },
    style: {
      background: "linear-gradient(135deg, #0a1628, #0d1f3c)",
      border: "2px solid oklch(0.82 0.18 85 / 0.5)",
      color: "oklch(0.88 0.22 85)",
    },
  },
  {
    id: "spin-dave-wheel",
    label: "🎰 Spin the Dave Wheel",
    popup: {
      emoji: "🎰",
      title: "THE DAVE WHEEL SPINS!",
      message:
        "THE DAVE WHEEL IS SPINNING! Whatever it lands on... you gotta respect it. No refunds. This is Florida Dave law. 🎰",
    },
    style: {
      background: "linear-gradient(135deg, #1a0a2e, #2d1050)",
      border: "2px solid oklch(0.65 0.22 310 / 0.6)",
      color: "oklch(0.82 0.18 85)",
    },
    spinEmoji: true,
  },
];

export function GameButtonsPanel() {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [roastOpen, setRoastOpen] = useState(false);
  const [blessOpen, setBlessOpen] = useState(false);
  const [vipOpen, setVipOpen] = useState(false);

  return (
    <section className="w-full max-w-lg mx-auto px-4 pb-4">
      <h2
        className="text-center text-xl font-black uppercase tracking-widest mb-4"
        style={{
          fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
          color: "oklch(0.88 0.22 85)",
          textShadow: "0 0 24px oklch(0.82 0.18 85 / 0.7)",
        }}
      >
        ⚡ Power-Ups &amp; Boosts
      </h2>

      {/* Featured: Get Lucky Boost */}
      <button
        type="button"
        data-ocid="game_buttons.primary_button"
        onClick={() =>
          setPopup({
            emoji: "🎣",
            title: "LUCKY BOOST ACTIVATED!",
            message:
              "BOOM! Florida Dave just blessed your line! Reel 'em in, you lucky pier legend! 🌊🎣",
          })
        }
        className="w-full mb-3 py-5 rounded-2xl font-black text-xl uppercase tracking-wider active:scale-95 transition-all animate-gold-pulse"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.72 0.20 78), oklch(0.82 0.18 85), oklch(0.72 0.20 78))",
          color: "oklch(0.10 0.01 250)",
          fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
          border: "none",
          letterSpacing: "0.08em",
          minHeight: "64px",
        }}
      >
        🎣 Get Lucky Boost
      </button>

      {/* 2-column grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {BUTTONS.map((btn) => (
          <button
            type="button"
            key={btn.id}
            data-ocid={`game_buttons.${btn.id}.button`}
            onClick={() => setPopup(btn.popup)}
            className="py-4 rounded-2xl font-black text-sm uppercase tracking-wide active:scale-95 transition-all hover:brightness-110 flex items-center justify-center gap-1"
            style={{
              ...btn.style,
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
              minHeight: "56px",
            }}
          >
            {btn.label}
          </button>
        ))}

        {/* Roast Me / Bless Me split */}
        <div
          className="rounded-2xl overflow-hidden flex"
          style={{
            minHeight: "56px",
            border: "2px solid oklch(0.82 0.18 85 / 0.3)",
          }}
        >
          <button
            type="button"
            data-ocid="game_buttons.roast.button"
            onClick={() => setRoastOpen(true)}
            className="flex-1 py-4 font-black text-xs uppercase tracking-wide active:scale-95 transition-all flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #2a0a0a, #3d1010)",
              color: "oklch(0.75 0.18 30)",
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
              borderRight: "1px solid oklch(0.82 0.18 85 / 0.2)",
            }}
          >
            😂 Roast
          </button>
          <button
            type="button"
            data-ocid="game_buttons.bless.button"
            onClick={() => setBlessOpen(true)}
            className="flex-1 py-4 font-black text-xs uppercase tracking-wide active:scale-95 transition-all flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #1a1200, #2a1e00)",
              color: "oklch(0.88 0.22 85)",
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            }}
          >
            🙏 Bless
          </button>
        </div>
      </div>

      {/* VIP Fisher - full width premium */}
      <button
        type="button"
        data-ocid="game_buttons.vip.button"
        onClick={() => setVipOpen(true)}
        className="w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest active:scale-95 transition-all relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.08 0.01 250), oklch(0.12 0.02 250))",
          border: "2.5px solid oklch(0.82 0.18 85)",
          color: "oklch(0.88 0.22 85)",
          fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
          boxShadow:
            "0 0 30px oklch(0.82 0.18 85 / 0.3), inset 0 1px 0 oklch(0.82 0.18 85 / 0.15)",
          minHeight: "60px",
          textShadow: "0 0 20px oklch(0.88 0.22 85 / 0.8)",
        }}
      >
        <span
          className="absolute top-1 right-2 text-xs font-black uppercase px-2 py-0.5 rounded-full"
          style={{
            background: "oklch(0.82 0.18 85)",
            color: "oklch(0.10 0.01 250)",
            fontSize: "0.6rem",
            letterSpacing: "0.12em",
          }}
        >
          VIP
        </span>
        🏆 VIP Fisher
      </button>

      {/* Shared popup dialog */}
      <GameDialog open={!!popup} onClose={() => setPopup(null)} data={popup} />

      {/* Roast dialog */}
      <Dialog open={roastOpen} onOpenChange={(v) => !v && setRoastOpen(false)}>
        <DialogContent
          className="max-w-sm mx-auto text-center"
          style={{
            background: "linear-gradient(160deg, #1a0505, #2d0a0a)",
            border: "2px solid oklch(0.65 0.22 30 / 0.7)",
            borderRadius: "1.5rem",
            boxShadow: "0 0 60px oklch(0.65 0.22 30 / 0.3)",
          }}
        >
          <DialogHeader>
            <div className="text-4xl mb-2">😂</div>
            <DialogTitle
              style={{
                fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                color: "oklch(0.75 0.18 30)",
                fontSize: "1.25rem",
                fontWeight: 900,
                textTransform: "uppercase",
              }}
            >
              FLORIDA DAVE ROASTS YOU!
            </DialogTitle>
            <DialogDescription
              style={{
                color: "oklch(0.72 0.08 30)",
                fontSize: "1rem",
                fontWeight: 600,
                lineHeight: 1.6,
              }}
            >
              Bro, you fish like you&apos;re scared of the water. Florida Dave
              has seen better casts from a flamingo! 😂
            </DialogDescription>
          </DialogHeader>
          <button
            type="button"
            data-ocid="game_roast.close_button"
            onClick={() => setRoastOpen(false)}
            className="mt-2 w-full py-3 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
            style={{
              background: "oklch(0.65 0.22 30)",
              color: "white",
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            }}
          >
            Oof, Fair 😅
          </button>
        </DialogContent>
      </Dialog>

      {/* Bless dialog */}
      <Dialog open={blessOpen} onOpenChange={(v) => !v && setBlessOpen(false)}>
        <DialogContent
          className="max-w-sm mx-auto text-center"
          style={{
            background: "linear-gradient(160deg, #0a1010, #0d1f14)",
            border: "2px solid oklch(0.82 0.18 85 / 0.7)",
            borderRadius: "1.5rem",
            boxShadow: "0 0 60px oklch(0.82 0.18 85 / 0.3)",
          }}
        >
          <DialogHeader>
            <div className="text-4xl mb-2">🙏</div>
            <DialogTitle
              style={{
                fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                color: "oklch(0.88 0.22 85)",
                textShadow: "0 0 20px oklch(0.82 0.18 85 / 0.8)",
                fontSize: "1.25rem",
                fontWeight: 900,
                textTransform: "uppercase",
              }}
            >
              YOU ARE BLESSED!
            </DialogTitle>
            <DialogDescription
              style={{
                color: "oklch(0.78 0.10 140)",
                fontSize: "1rem",
                fontWeight: 600,
                lineHeight: 1.6,
              }}
            >
              May the Gulf winds guide your line and the tarpon fear your
              presence. You are BLESSED by Florida Dave! 🙏✨
            </DialogDescription>
          </DialogHeader>
          <button
            type="button"
            data-ocid="game_bless.close_button"
            onClick={() => setBlessOpen(false)}
            className="mt-2 w-full py-3 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.82 0.18 85), oklch(0.72 0.20 78))",
              color: "oklch(0.10 0.01 250)",
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            }}
          >
            Blessed! ✨
          </button>
        </DialogContent>
      </Dialog>

      {/* VIP dialog */}
      <Dialog open={vipOpen} onOpenChange={(v) => !v && setVipOpen(false)}>
        <DialogContent
          className="max-w-sm mx-auto text-center"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.08 0.01 250), oklch(0.12 0.02 250))",
            border: "2.5px solid oklch(0.82 0.18 85)",
            borderRadius: "1.5rem",
            boxShadow: "0 0 60px oklch(0.82 0.18 85 / 0.4)",
          }}
        >
          <DialogHeader>
            <div className="text-4xl mb-2">👑</div>
            <DialogTitle
              style={{
                fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                color: "oklch(0.88 0.22 85)",
                textShadow: "0 0 24px oklch(0.82 0.18 85 / 0.9)",
                fontSize: "1.25rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              WELCOME TO THE CLUB
            </DialogTitle>
            <DialogDescription
              style={{
                color: "oklch(0.75 0.12 85)",
                fontSize: "1rem",
                fontWeight: 600,
                lineHeight: 1.6,
              }}
            >
              VIP Fishers don&apos;t wait in line. You cast first. You leave
              last. Florida Dave sees you. 👑🏆
            </DialogDescription>
          </DialogHeader>
          <button
            type="button"
            data-ocid="game_vip.close_button"
            onClick={() => setVipOpen(false)}
            className="mt-2 w-full py-3 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.82 0.18 85), oklch(0.72 0.20 78))",
              color: "oklch(0.10 0.01 250)",
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
              boxShadow: "0 4px 20px oklch(0.82 0.18 85 / 0.5)",
            }}
          >
            Respect. 👑
          </button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
