import Link from "@/compat/next-link";
import { SectionHeader } from "@/components/home/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";

const ownerCards = [
  {
    title: "Publish a stronger public page",
    description:
      "Control the public profile, contact details, booking policy, branding, and booking handoff mode from one settings area.",
  },
  {
    title: "Run bookings with less friction",
    description:
      "Bookings, blocks, and calendar views are already scaffolded around the current admin API, so operators stay close to the real data model.",
  },
  {
    title: "Scale the frontend without rewrites",
    description:
      "API endpoints, placeholder adapters, and reusable components are separated so new backend capabilities can replace mock layers cleanly.",
  },
];

export function StudioOwnersSection() {
  return (
    <section className="section owners-section">
      <div className="container owners-grid">
        <div className="stack-lg">
          <SectionHeader
            eyebrow="For studio owners"
            title="A platform that helps studios publish, convert, and operate"
            description="The operator-facing side of the product is not an afterthought. Owners can move from account creation into a dashboard built around studio management."
          />

          <div className="hero-actions">
            <Link href="/register" className="button">
              Create owner account
            </Link>
            <Link href="/login" className="button button-secondary">
              Open operator login
            </Link>
          </div>
        </div>

        <div className="marketing-card-grid">
          {ownerCards.map((card) => (
            <SurfaceCard className="marketing-card" key={card.title}>
              <span className="eyebrow">Owner value</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </section>
  );
}
