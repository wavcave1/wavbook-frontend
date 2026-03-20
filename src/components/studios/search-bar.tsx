"use client";

interface SearchBarProps {
  action?: string;
  defaultQuery?: string;
  defaultLocation?: string;
  title?: string;
  subtitle?: string;
}

export function SearchBar({
  action = "/studios",
  defaultQuery = "",
  defaultLocation = "",
  title = "Find the right room fast",
  subtitle = "Search published studios by name, slug, and location.",
}: SearchBarProps) {
  return (
    <form className="search-bar" action={action} method="GET">
      <div className="search-copy">
        <span className="eyebrow">{title}</span>
        <p>{subtitle}</p>
      </div>

      <label className="field">
        <span>Studio</span>
        <input
          className="input"
          name="q"
          placeholder="WAV CAVE North"
          defaultValue={defaultQuery}
        />
      </label>

      <label className="field">
        <span>Location</span>
        <input
          className="input"
          name="location"
          placeholder="Chicago"
          defaultValue={defaultLocation}
        />
      </label>

      <button className="button" type="submit">
        Search studios
      </button>
    </form>
  );
}
