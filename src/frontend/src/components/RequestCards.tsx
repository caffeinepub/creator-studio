import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useState } from "react";
import BookingModal, { type VideoOption } from "./BookingModal";

const videoOptions: (VideoOption & {
  color: string;
  bgFrom: string;
  bgTo: string;
})[] = [
  {
    title: "Birthday Shoutout",
    price: 20,
    description: "The perfect birthday surprise for someone special",
    emoji: "🎂",
    color: "oklch(0.58 0.22 28)",
    bgFrom: "oklch(0.97 0.04 28)",
    bgTo: "oklch(0.93 0.06 28)",
  },
  {
    title: "Florida Dave Motivation",
    price: 20,
    description: "Get fired up with a custom hype video",
    emoji: "🔥",
    color: "oklch(0.52 0.19 240)",
    bgFrom: "oklch(0.96 0.04 240)",
    bgTo: "oklch(0.92 0.06 230)",
  },
  {
    title: "Fishing Luck Blessing",
    price: 15,
    description: "May your lines never be empty",
    emoji: "🎣",
    color: "oklch(0.50 0.18 200)",
    bgFrom: "oklch(0.96 0.04 200)",
    bgTo: "oklch(0.92 0.06 200)",
  },
  {
    title: "Chaos Message",
    price: 5,
    description: "Pure unfiltered Florida Dave energy",
    emoji: "🌀",
    color: "oklch(0.52 0.22 310)",
    bgFrom: "oklch(0.96 0.04 310)",
    bgTo: "oklch(0.93 0.06 300)",
  },
  {
    title: "Wheel of Chaos Spin",
    price: 10,
    description: "Spin the wheel, anything goes!",
    emoji: "🎡",
    color: "oklch(0.55 0.2 155)",
    bgFrom: "oklch(0.96 0.04 155)",
    bgTo: "oklch(0.92 0.06 150)",
  },
];

const OCID_MAP: Record<number, string> = {
  0: "request_card.book_button.1",
  1: "request_card.book_button.2",
  2: "request_card.book_button.3",
  3: "request_card.book_button.4",
  4: "request_card.book_button.5",
};

export default function RequestCards() {
  const [selectedOption, setSelectedOption] = useState<VideoOption | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleBook = (option: VideoOption) => {
    setSelectedOption(option);
    setModalOpen(true);
  };

  return (
    <section
      data-ocid="request_cards.section"
      className="py-16 px-4 max-w-5xl mx-auto"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          Choose Your Video 🎬
        </h2>
        <p className="text-muted-foreground font-body text-base md:text-lg max-w-md mx-auto">
          Pick the type of personalized message you'd like from Florida Dave
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videoOptions.map((option, i) => (
          <motion.div
            key={option.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
          >
            <div
              className="tropical-card h-full flex flex-col overflow-hidden"
              style={{
                background: `linear-gradient(145deg, ${option.bgFrom} 0%, ${option.bgTo} 100%)`,
              }}
            >
              {/* Card top */}
              <div className="p-5 flex-1">
                {/* Emoji badge */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm"
                  style={{
                    background: `${option.color.replace(")", " / 0.12)")}`,
                  }}
                >
                  {option.emoji}
                </div>

                <h3 className="font-display font-bold text-lg text-foreground mb-1">
                  {option.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
              </div>

              {/* Card bottom */}
              <div className="px-5 pb-5 flex items-center justify-between">
                <span
                  className="font-display text-2xl font-extrabold"
                  style={{ color: option.color }}
                >
                  ${option.price}
                </span>
                <Button
                  data-ocid={OCID_MAP[i]}
                  onClick={() => handleBook(option)}
                  className="rounded-full px-5 font-display font-bold text-sm transition-transform active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${option.color} 0%, ${option.color.replace(")", " / 0.8)")} 100%)`,
                    color: "white",
                  }}
                >
                  Book Now →
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedOption={selectedOption}
      />
    </section>
  );
}
