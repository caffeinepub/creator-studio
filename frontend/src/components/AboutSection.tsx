import WaveDivider from './WaveDivider';
import { Waves } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-10">
      <WaveDivider />

      <div className="mt-10 mb-10 max-w-2xl mx-auto text-center px-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Waves className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold font-display tracking-tight">About Florida Dave</h2>
          <Waves className="h-5 w-5 text-primary" />
        </div>

        <p className="text-muted-foreground leading-relaxed text-base">
          Florida Dave is a 40-year-old entrepreneur building ideas out in the open — from content
          creation and video storytelling to domain investing and digital ventures. He's documenting
          the real journey: the wins, the experiments, and the grind toward location freedom and a
          life lived closer to the beach.
        </p>
      </div>

      <WaveDivider />
    </section>
  );
}
