import { SectionHeader } from "@/components/home/section-header";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { SurfaceCard } from "@/components/ui/surface-card";
import { homepageTestimonialPlaceholders } from "@/lib/mocks/homepage";

export function TestimonialsPlaceholderSection() {
  return (
    <section className="section section-muted">
      <div className="container stack-lg">
        <SectionHeader
          eyebrow="Testimonials and reviews"
          title="Reserved for social proof once a review source is wired"
          description="This block is intentionally a placeholder. It keeps the layout ready for testimonials without inventing live customer review behavior."
        />

        <NoticeBanner title="Placeholder section" tone="muted">
          <p>
            Replace these cards with a real reviews or testimonials feed when
            that source exists. The homepage structure does not need to change.
          </p>
        </NoticeBanner>

        <div className="marketing-card-grid">
          {homepageTestimonialPlaceholders.map((item) => (
            <SurfaceCard className="testimonial-placeholder-card" key={item.title}>
              <span className="eyebrow">Reserved block</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </section>
  );
}
