import { SectionHeader } from "@/components/home/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";

const steps = [
  {
    number: "01",
    title: "Discover studios",
    description:
      "Customers search the marketplace by studio name or location, then open a public profile with the studio’s key details and booking policy.",
  },
  {
    number: "02",
    title: "Choose a session",
    description:
      "From the public booking page, customers select a package, pick a time, and continue into the existing payment-intent flow.",
  },
  {
    number: "03",
    title: "Manage operations",
    description:
      "Studio operators work from the app dashboard to review bookings, manage blackout windows, update public details, and keep the calendar clean.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="section">
      <div className="container stack-lg">
        <SectionHeader
          eyebrow="How it works"
          title="One product for the public flow and the operator workflow"
          description="The homepage should make the platform mechanics obvious without forcing either audience into the wrong interface."
          center
        />

        <div className="step-grid">
          {steps.map((step) => (
            <SurfaceCard className="step-card" key={step.number}>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </section>
  );
}
