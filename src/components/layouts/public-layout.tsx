import { Footer } from "@/components/navigation/footer";
import { Navbar } from "@/components/navigation/navbar";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-layout">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
