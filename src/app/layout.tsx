import "./globals.css";

export const metadata = {
  title: "WAV CAVE Studios",
  description: "Marketplace and studio operator frontend for a booking SaaS platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
