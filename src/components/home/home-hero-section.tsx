import Link from "next/link";
import { SearchBar } from "@/components/studios/search-bar";
import { StatCard } from "@/components/ui/stat-card";

interface HomeHeroSectionProps {
  publishedStudioCount: number;
  featuredStudioCount: number;
}

const proofPoints = [
  "Public studio discovery that stays easy to scan on mobile.",
  "Booking handoff built to connect to the existing payment-intent flow.",
  "Operator pages for bookings, calendar, blocks, and settings.",
];

export function HomeHeroSection({
  publishedStudioCount,
  featuredStudioCount,
}: HomeHeroSectionProps) {
  return (
    <section className="hero-section home-hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Studio marketplace and booking platform</span>
          <h1 className="display-title">
            Book the right studio faster. Run the studio without scattered tools.
          </h1>
          <p className="lead-copy">
            WAV CAVE gives customers a clean marketplace to discover published
            studios and gives operators a focused workspace to manage bookings,
            schedules, blocks, branding, and public pages.
          </p>

          <div className="hero-actions">
            <Link href="/studios" className="button">
              Browse studios
            </Link>
            <Link href="/register" className="button button-secondary">
              List your studio
            </Link>
          </div>

          <div className="hero-proof-list">
            {proofPoints.map((item) => (
              <div className="hero-proof-item" key={item}>
                <span className="hero-proof-dot" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-panel">
          <SearchBar
            title="Search published studios"
            subtitle="Jump straight into the marketplace by studio name or location."
          />

          <div className="home-stat-grid">
            <StatCard
              label="Published studios"
              value={String(publishedStudioCount)}
              detail="Read from the marketplace endpoint."
            />
            <StatCard
              label="Featured listings"
              value={String(featuredStudioCount)}
              detail="Used to merchandise the public landing page."
            />
            <StatCard
              label="Operator modules"
              value="Bookings · Calendar · Settings"
              detail="One frontend for the public and operator experience."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
