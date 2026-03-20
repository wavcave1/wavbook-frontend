import Link from "next/link";
import { PublicLayout } from "@/components/layouts/public-layout";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <PublicLayout>
      <section className="section">
        <div className="container">
          <EmptyState
            title="Page not found"
            description="The requested route does not exist in this scaffold."
          />
          <div className="center-actions">
            <Link href="/" className="button">
              Back to marketplace
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
