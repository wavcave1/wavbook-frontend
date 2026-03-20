import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <span className="eyebrow">WAV CAVE</span>
          <p>
            A booking marketplace for customers and an operator workspace for
            studio teams that need cleaner scheduling and public pages.
          </p>
        </div>

        <div>
          <span className="eyebrow">Customers</span>
          <div className="footer-link-list">
            <Link href="/">Homepage</Link>
            <Link href="/studios">Browse studios</Link>
          </div>
        </div>

        <div>
          <span className="eyebrow">Studio owners</span>
          <div className="footer-link-list">
            <Link href="/register">Create account</Link>
            <Link href="/login">Operator login</Link>
            <Link href="/app">Operator app</Link>
          </div>
        </div>

        <div>
          <span className="eyebrow">Build notes</span>
          <p>
            Featured studios use the marketplace API first and fall back to a
            local mock dataset only when the API is unavailable.
          </p>
        </div>
      </div>
    </footer>
  );
}
