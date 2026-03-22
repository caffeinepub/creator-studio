import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export function FloatingBoostButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        data-ocid="game_boost.primary_button"
        onClick={() => setOpen(true)}
        className="fixed z-50 animate-gold-pulse active:scale-95 transition-all"
        style={{
          bottom: "80px",
          right: "16px",
          height: "56px",
          padding: "0 20px",
          borderRadius: "999px",
          background:
            "linear-gradient(135deg, oklch(0.72 0.20 78), oklch(0.85 0.20 88))",
          color: "oklch(0.10 0.01 250)",
          fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
          fontWeight: 900,
          fontSize: "0.9rem",
          border: "none",
          cursor: "pointer",
          whiteSpace: "nowrap",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        🎣 Boost!
      </button>

      <Dialog open={open} onOpenChange={(v) => !v && setOpen(false)}>
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
            <div className="text-4xl mb-2">🎣</div>
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
              LUCKY BOOST ACTIVATED!
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
              BOOM! Florida Dave just blessed your line! Reel &apos;em in, you
              lucky pier legend! 🌊🎣
            </DialogDescription>
          </DialogHeader>
          <button
            type="button"
            data-ocid="game_boost_popup.close_button"
            onClick={() => setOpen(false)}
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
    </>
  );
}
