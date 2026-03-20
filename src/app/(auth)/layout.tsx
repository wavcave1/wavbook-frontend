import { PublicLayout } from "@/components/layouts/public-layout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicLayout>
      <section className="auth-screen">
        <div className="container">{children}</div>
      </section>
    </PublicLayout>
  );
}
