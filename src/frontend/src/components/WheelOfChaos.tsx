import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const SEGMENTS = [
  { label: "Roast Your Friend", emoji: "😂", color: "#e84393" },
  { label: "Fishing Blessing", emoji: "🎣", color: "#0ea5e9" },
  { label: "Florida Motivation", emoji: "🔥", color: "#f97316" },
  { label: "Beach Wisdom", emoji: "🏖️", color: "#14b8a6" },
  { label: "Chaos Rant", emoji: "🌀", color: "#8b5cf6" },
  { label: "Pirate Mode", emoji: "🏴‍☠️", color: "#1d4ed8" },
  { label: "Birthday Blast", emoji: "🎂", color: "#f59e0b" },
];

const NUM_SEGMENTS = SEGMENTS.length;
const FULL_CIRCLE = 2 * Math.PI;
const SEGMENT_ANGLE = FULL_CIRCLE / NUM_SEGMENTS;

function drawWheel(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 6;

  ctx.clearRect(0, 0, size, size);

  // Outer glow ring
  const glow = ctx.createRadialGradient(cx, cy, r - 8, cx, cy, r + 6);
  glow.addColorStop(0, "rgba(255,255,255,0.1)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.beginPath();
  ctx.arc(cx, cy, r + 6, 0, FULL_CIRCLE);
  ctx.fillStyle = glow;
  ctx.fill();

  // Segments
  for (let i = 0; i < NUM_SEGMENTS; i++) {
    const start = i * SEGMENT_ANGLE - Math.PI / 2;
    const end = start + SEGMENT_ANGLE;
    const seg = SEGMENTS[i];

    // Segment fill
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();

    // Segment border
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label text
    ctx.save();
    ctx.translate(cx, cy);
    const midAngle = start + SEGMENT_ANGLE / 2;
    ctx.rotate(midAngle);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = `bold ${Math.max(11, size / 28)}px 'Bricolage Grotesque', sans-serif`;
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 3;
    ctx.fillText(`${seg.emoji} ${seg.label}`, r - 12, 5);
    ctx.restore();
  }

  // Center circle
  const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
  centerGrad.addColorStop(0, "#ffffff");
  centerGrad.addColorStop(1, "#e0e8f8");
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, FULL_CIRCLE);
  ctx.fillStyle = centerGrad;
  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Center icon
  ctx.font = "22px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🌀", cx, cy);
}

export default function WheelOfChaos() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<(typeof SEGMENTS)[number] | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size =
      typeof window === "undefined"
        ? 380
        : Math.min(380, window.innerWidth - 64);
    canvas.width = size;
    canvas.height = size;
    drawWheel(canvas);
  }, []);

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Random total spin: 6-10 full rotations plus extra
    const extraDeg = Math.random() * 360;
    const totalRotation = (7 + Math.random() * 4) * 360 + extraDeg;
    const durationMs = 4000 + Math.random() * 1500;
    const startTime = performance.now();
    const startRotation = rotationRef.current;

    const ease = (t: number) => 1 - (1 - t) ** 4;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / durationMs, 1);
      const currentRot = startRotation + totalRotation * ease(t);
      rotationRef.current = currentRot;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const size = canvas.width;
      const cx = size / 2;
      const cy = size / 2;

      ctx.save();
      ctx.clearRect(0, 0, size, size);
      ctx.translate(cx, cy);
      ctx.rotate((currentRot * Math.PI) / 180);
      ctx.translate(-cx, -cy);
      drawWheel(canvas);
      ctx.restore();

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Determine winner: pointer is fixed at top (12 o'clock).
        // Segment 0 starts at -90deg (top) in drawWheel.
        // We need the angle on the wheel that ends up at the top after rotation.
        // The pointer points at angle (360 - finalDeg) on the original wheel.
        // Segment i occupies [(i * segDeg - 90), (i+1) * segDeg - 90) degrees.
        // Normalize pointer angle relative to the top-start offset.
        const finalDeg = ((currentRot % 360) + 360) % 360;
        const segDeg = 360 / NUM_SEGMENTS;
        // Which original wheel angle is under the pointer (top = 0 after rotation)
        const pointerAngle = (360 - finalDeg + 360) % 360;
        // Add 90 because segments start drawn from -90 (top)
        const normalizedAngle = (pointerAngle + 90) % 360;
        const winIndex = Math.floor(normalizedAngle / segDeg) % NUM_SEGMENTS;
        setResult(SEGMENTS[winIndex]);
        setSpinning(false);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [spinning]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <section
      data-ocid="chaos_wheel.section"
      className="py-16 px-4"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.97 0.01 220) 0%, oklch(0.94 0.03 230) 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            🌀 Florida Dave Wheel of Chaos
          </h2>
          <p className="text-muted-foreground font-body text-base md:text-lg">
            Not sure what to order? Spin the wheel and let fate decide!
          </p>
        </motion.div>

        {/* Wheel container */}
        <div className="flex flex-col items-center gap-6">
          {/* Pointer */}
          <div className="relative flex justify-center items-start">
            {/* Arrow pointer */}
            <div
              className="absolute top-0 z-10 w-0 h-0"
              style={{
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: "24px solid oklch(0.42 0.22 245)",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                transform: "translateY(-4px)",
              }}
            />
            {/* Canvas */}
            <canvas
              ref={canvasRef}
              data-ocid="chaos_wheel.canvas_target"
              className="rounded-full shadow-tropical"
              style={{ display: "block" }}
            />
          </div>

          {/* Spin Button */}
          <Button
            data-ocid="chaos_wheel.spin_button"
            onClick={spin}
            disabled={spinning}
            className="rounded-full px-10 py-4 font-display font-extrabold text-lg shadow-glow transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: spinning
                ? "oklch(0.7 0.06 240)"
                : "linear-gradient(135deg, oklch(0.42 0.22 245) 0%, oklch(0.60 0.20 220) 100%)",
              color: "white",
              minWidth: "200px",
            }}
          >
            {spinning ? "Spinning... 🌀" : "🌀 Spin the Wheel!"}
          </Button>

          {/* Result */}
          <AnimatePresence>
            {result && !spinning && (
              <motion.div
                key={result.label}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-2xl p-5 text-center shadow-tropical border w-full max-w-sm"
                style={{
                  background: `${result.color}18`,
                  borderColor: `${result.color}40`,
                }}
              >
                <div className="text-4xl mb-2">{result.emoji}</div>
                <h3
                  className="font-display text-xl font-extrabold mb-1"
                  style={{ color: result.color }}
                >
                  {result.label}!
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  The wheel has spoken! Book your{" "}
                  <strong>{result.label}</strong> video now 👇
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
