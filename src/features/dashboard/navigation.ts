export interface DashboardNavItem {
  href: string;
  label: string;
}

export interface DashboardNavGroup {
  title: string;
  items: DashboardNavItem[];
}

export const getStudioNavigation = (slug: string): DashboardNavGroup[] => [
  {
    title: "Overview",
    items: [
      { href: `/app/studio/${slug}/dashboard`, label: "Dashboard" },
      { href: `/app/studio/${slug}/bookings`, label: "Bookings" },
      { href: `/app/studio/${slug}/calendar`, label: "Calendar" },
      { href: `/app/studio/${slug}/blocks`, label: "Blocks" },
    ],
  },
  {
    title: "Settings",
    items: [
      { href: `/app/studio/${slug}/settings/profile`, label: "Profile" },
      { href: `/app/studio/${slug}/settings/contact`, label: "Contact" },
      { href: `/app/studio/${slug}/settings/branding`, label: "Branding" },
      { href: `/app/studio/${slug}/settings/booking`, label: "Booking" },
      { href: `/app/studio/${slug}/settings/public-page`, label: "Public page" },
    ],
  },
];

export const getStudioSettingsLinks = (slug: string): DashboardNavItem[] => [
  { href: `/app/studio/${slug}/settings/profile`, label: "Profile" },
  { href: `/app/studio/${slug}/settings/contact`, label: "Contact" },
  { href: `/app/studio/${slug}/settings/branding`, label: "Branding" },
  { href: `/app/studio/${slug}/settings/booking`, label: "Booking" },
  { href: `/app/studio/${slug}/settings/public-page`, label: "Public page" },
];
