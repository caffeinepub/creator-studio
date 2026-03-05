import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section
      data-ocid="header.section"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.42 0.22 245) 0%, oklch(0.55 0.2 225) 45%, oklch(0.65 0.18 200) 100%)",
      }}
    >
      {/* Decorative palm trees & wave background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left palm silhouette */}
        <div className="absolute -top-4 -left-6 text-[140px] opacity-15 select-none leading-none">
          🌴
        </div>
        {/* Top-right palm */}
        <div className="absolute -top-4 -right-6 text-[140px] opacity-15 select-none leading-none scale-x-[-1]">
          🌴
        </div>
        {/* Floating emojis */}
        <motion.div
          className="absolute top-12 left-[10%] text-3xl opacity-30"
          animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          ☀️
        </motion.div>
        <motion.div
          className="absolute top-20 right-[12%] text-2xl opacity-25"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 3.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          🌊
        </motion.div>
        <motion.div
          className="absolute bottom-16 left-[20%] text-2xl opacity-20"
          animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          🎥
        </motion.div>
        {/* Wave shape at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            aria-hidden="true"
          >
            <path
              d="M0,30 C240,55 480,5 720,30 C960,55 1200,5 1440,30 L1440,60 L0,60 Z"
              fill="oklch(0.97 0.01 220)"
            />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-16 pb-24 text-center">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/80 shadow-2xl overflow-hidden">
              <img
                src="/assets/generated/florida-dave-hero.dim_400x400.jpg"
                alt="Florida Dave"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online badge */}
            <div className="absolute bottom-2 right-2 bg-green-400 border-2 border-white w-5 h-5 rounded-full shadow-sm" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="font-display text-4xl md:text-6xl font-extrabold text-white mb-3 leading-tight"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.25)" }}
        >
          Book Florida Dave 🎥🌴
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-lg md:text-2xl text-white/90 mb-6 font-body max-w-xl mx-auto"
        >
          Get a personalized video message from Florida Dave.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex justify-center gap-6 md:gap-10 flex-wrap"
        >
          {[
            { label: "Videos Made", value: "500+" },
            { label: "Happy Fans", value: "1,200+" },
            { label: "Response Time", value: "48hrs" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-white font-display">
                {stat.value}
              </div>
              <div className="text-white/70 text-sm font-body">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
