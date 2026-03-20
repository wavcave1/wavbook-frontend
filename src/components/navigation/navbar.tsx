"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Marketplace" },
  { href: "/studios", label: "Studios" },
  { href: "/login", label: "Login" },
  { href: "/app", label: "Operator app" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="navbar-shell">
      <div className="container">
        <nav className="navbar">
          <Link href="/" className="brand-mark">
            <span>WAV CAVE</span>
            <small>Book studios without the back-and-forth.</small>
          </Link>

          <div className="nav-links">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "nav-link",
                  pathname === link.href && "nav-link-active",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
