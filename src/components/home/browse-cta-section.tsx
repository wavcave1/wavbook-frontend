import Link from "next/link";
import { FilterPanel } from "@/components/studios/filter-panel";
import { SurfaceCard } from "@/components/ui/surface-card";
import { SectionHeader } from "@/components/home/section-header";

interface BrowseCtaSectionProps {
  locations: string[];
}

const browseCards = [
  {
    title: "Browse by city or neighborhood",
    description:
      "Use the marketplace browse page to compare published studios without making customers dig through operator-only details.",
    href: "/studios",
    label: "Open marketplace",
  },
  {
    title: "Book from the public profile",
    description:
      "Each published profile can flow into a studio-specific booking page, keeping discovery and checkout connected.",
    href: "/studios",
    label: "See public profiles",
  },
];

export function BrowseCtaSection({ locations }: BrowseCtaSectionProps) {
  return (
    <section className="section section-muted">
      <div className="container stack-lg">
        <SectionHeader
          eyebrow="Browse and book"
          title="Give customers a clear path from discovery to checkout"
          description="The public homepage should move quickly: explain the value, let people browse, and point them toward a live studio profile."
          action={
            <Link href="/studios" className="button button-secondary">
              Explore all studios
            </Link>
          }
        />

        <FilterPanel locations={locations} />

        <div className="marketing-card-grid">
          {browseCards.map((card) => (
            <SurfaceCard className="marketing-card" key={card.title}>
              <span className="eyebrow">Customer path</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link href={card.href} className="button button-secondary">
                {card.label}
              </Link>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </section>
  );
}
