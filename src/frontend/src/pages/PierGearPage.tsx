import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Anchor, Fish, Package, ShoppingBag, Sun, Waves } from "lucide-react";
import { motion } from "motion/react";

const products = [
  {
    id: 1,
    name: "Florida Dave Network Shirt",
    description:
      "Lightweight dark blue shirt with the Florida Dave Network logo. Perfect for fishing, beach days, and representing the Florida Dave Network.",
    emoji: "👕",
    icon: ShoppingBag,
    status: "preorder" as const,
  },
  {
    id: 2,
    name: "Florida Dave Sun Protection Fishing Hat",
    description:
      "Breathable dark blue fishing hat with neck sun flap and adjustable fit. Designed for long days under the Florida sun.",
    emoji: "🧢",
    icon: Sun,
    status: "preorder" as const,
  },
  {
    id: 3,
    name: "Florida Dave Fishing Bag",
    description:
      "Compact pier fishing bag designed to carry tackle, bait, and essentials without taking up too much space.",
    emoji: "🎒",
    icon: Package,
    status: "preorder" as const,
  },
  {
    id: 4,
    name: "Florida Dave Solar Fish Cooker",
    description:
      "A portable solar cooking bag designed to cook fresh fish using only the power of the sun. Perfect for fishing trips and outdoor adventures.",
    emoji: "☀️",
    icon: Fish,
    status: "soon" as const,
  },
];

export default function PierGearPage() {
  return (
    <main data-ocid="pier_gear.page" className="min-h-screen pier-gear-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden pier-hero-section">
        <div className="absolute inset-0 pier-hero-overlay" />
        <div className="absolute top-8 left-8 opacity-10" aria-hidden="true">
          <Anchor className="h-32 w-32 text-white" />
        </div>
        <div
          className="absolute bottom-12 right-12 opacity-10"
          aria-hidden="true"
        >
          <Fish className="h-24 w-24 text-white" />
        </div>
        <div
          className="absolute top-1/2 right-1/4 opacity-5"
          aria-hidden="true"
        >
          <Waves className="h-40 w-40 text-white" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-16 pb-24 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-3xl" aria-hidden="true">
                🎣
              </span>
              <Badge className="pier-badge text-sm px-4 py-1 font-semibold tracking-wide uppercase">
                Official Merch
              </Badge>
              <span className="text-3xl" aria-hidden="true">
                🌊
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              Florida Dave
              <span className="block pier-gold-text">Pier Gear</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-200 font-medium mb-4 tracking-wide">
              Official Fishing Gear from the Florida Dave Network
            </p>
            <p className="text-base sm:text-lg text-blue-300 max-w-2xl mx-auto leading-relaxed">
              Built for long days on the pier, hot Florida sun, and big catches.
              Welcome to Florida Dave Pier Gear.
            </p>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0,30 C240,60 480,0 720,30 C960,60 1200,10 1440,30 L1440,60 L0,60 Z"
              fill="oklch(0.12 0.04 230)"
            />
          </svg>
        </div>
      </section>

      {/* Products Section */}
      <section className="pier-products-section py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              Shop the Gear
            </h2>
            <p className="pier-muted-text text-base">
              Designed for real Florida pier fishing. Built to last.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {products.map((product, index) => {
              const Icon = product.icon;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index + 0.3 }}
                  data-ocid={`pier_gear.product.item.${product.id}`}
                >
                  <Card className="pier-product-card h-full flex flex-col overflow-hidden">
                    <div className="pier-product-image-area relative flex flex-col items-center justify-center py-10 px-6">
                      <div className="pier-product-icon-circle mb-3">
                        <Icon
                          className="h-10 w-10 pier-gold-icon"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-5xl mb-2" aria-hidden="true">
                        {product.emoji}
                      </span>
                      {product.status === "soon" && (
                        <div className="absolute top-3 right-3">
                          <Badge className="pier-soon-badge text-xs">
                            Coming Soon
                          </Badge>
                        </div>
                      )}
                      {product.status === "preorder" && (
                        <div className="absolute top-3 right-3">
                          <Badge className="pier-preorder-badge text-xs">
                            Pre-Order
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="flex-1 pt-4 pb-2">
                      <h3 className="font-display text-lg font-bold text-white mb-2 leading-snug">
                        {product.name}
                      </h3>
                      <p className="pier-muted-text text-sm leading-relaxed">
                        {product.description}
                      </p>
                    </CardContent>

                    <CardFooter className="pt-2 pb-5 px-6">
                      {product.status === "preorder" ? (
                        <Button
                          data-ocid={`pier_gear.product.button.${product.id}`}
                          className="w-full pier-preorder-btn font-semibold tracking-wide"
                          onClick={() =>
                            window.open("https://www.floridadave.net", "_blank")
                          }
                        >
                          🛒 Pre-Order Now
                        </Button>
                      ) : (
                        <Button
                          data-ocid={`pier_gear.product.button.${product.id}`}
                          variant="outline"
                          disabled
                          className="w-full pier-soon-btn font-semibold tracking-wide cursor-not-allowed"
                        >
                          ⏳ Coming Soon
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="pier-banner py-14 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <div
            className="flex items-center justify-center gap-3 mb-3"
            aria-hidden="true"
          >
            <span className="text-2xl">🎣</span>
            <span className="text-2xl">🌊</span>
            <span className="text-2xl">☀️</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold pier-gold-text mb-3">
            More Florida Dave gear coming soon.
          </h2>
          <p className="text-blue-300 text-base">
            Stay tuned to the Florida Dave Network for new drops.
          </p>
        </div>
      </section>
    </main>
  );
}
