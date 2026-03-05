import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface DomainListing {
  name: string;
  description: string;
  price: string;
  badge?: string;
}

const domains: DomainListing[] = [];

function DomainCard({ domain }: { domain: DomainListing }) {
  return (
    <div className="group relative flex flex-col bg-card border border-border rounded-sm p-6 hover:border-primary/40 hover:shadow-card transition-all duration-200">
      {domain.badge && (
        <span className="absolute top-4 right-4">
          <Badge
            variant="outline"
            className="text-[10px] font-semibold uppercase tracking-widest border-primary/30 text-primary px-2 py-0.5"
          >
            {domain.badge}
          </Badge>
        </span>
      )}

      <div className="flex items-start gap-3 mb-3">
        <span className="flex-shrink-0 mt-0.5 flex items-center justify-center w-8 h-8 rounded-sm bg-muted">
          <Globe className="h-4 w-4 text-muted-foreground" />
        </span>
        <h3 className="text-lg font-bold font-display tracking-tight text-foreground leading-snug pr-12">
          {domain.name}
        </h3>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
        {domain.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
        <span className="text-xl font-bold text-foreground tracking-tight">
          {domain.price}
        </span>
        <Button
          size="sm"
          variant="outline"
          className="text-xs font-semibold uppercase tracking-wider border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Secure This Domain
        </Button>
      </div>
    </div>
  );
}

export default function DomainsSection() {
  return (
    <section className="py-12 px-4">
      {/* Section Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <span className="inline-block bg-muted text-muted-foreground text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-sm mb-4 border border-border">
          Florida Dave's Domains
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-foreground mb-3">
          Curated Digital Assets
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          Brand-ready domains selected for long-term positioning.
        </p>
      </div>

      {/* Domain Grid */}
      {domains.length > 0 ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {domains.map((domain) => (
            <DomainCard key={domain.name} domain={domain} />
          ))}
        </div>
      ) : (
        <div
          className="max-w-6xl mx-auto text-center py-16 border border-dashed border-border rounded-sm text-muted-foreground text-sm"
          data-ocid="domains.empty_state"
        >
          Domain listings coming soon.
        </div>
      )}
    </section>
  );
}
