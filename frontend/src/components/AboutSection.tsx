import WaveDivider from './WaveDivider';
import { MapPin, Globe, TrendingUp } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Profile card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src="/assets/generated/profile-avatar.dim_200x200.png"
                alt="Florida Dave"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-primary/30 shadow-glow"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background" />
            </div>
          </div>

          {/* Bio text */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-foreground mb-1">
              Florida Dave
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Florida, USA
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-primary" />
                Content Creator
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                Entrepreneur
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-base max-w-xl">
              40-year-old entrepreneur building ideas out in the open — from content creation and
              video storytelling to domain investing and digital ventures. Documenting the real
              journey: the wins, the experiments, and the grind toward location freedom and a life
              lived closer to the beach.
            </p>
          </div>
        </div>
      </div>

      <WaveDivider />
    </section>
  );
}
