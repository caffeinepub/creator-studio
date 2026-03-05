import { ExternalLink, Video, Star, Laugh, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const offerings = [
  { icon: Star, label: 'Birthday shoutouts' },
  { icon: Heart, label: 'Motivation & encouragement' },
  { icon: Laugh, label: 'Funny custom hype videos' },
  { icon: Video, label: 'Personal messages made just for you' },
];

export default function CameoSection() {
  return (
    <section className="py-8 px-4">
      <Card className="max-w-2xl mx-auto border border-border shadow-card bg-card">
        <CardContent className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Cameo
            </span>
            <h2 className="text-3xl font-bold font-display tracking-tight text-foreground">
              Personalized Video Messages
            </h2>
          </div>

          <ul className="space-y-4 mb-10">
            {offerings.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <span className="text-base font-medium text-foreground">{label}</span>
              </li>
            ))}
          </ul>

          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto text-base px-10 py-6 font-semibold shadow-md"
            >
              <a
                href="https://www.cameo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Book on Cameo
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
