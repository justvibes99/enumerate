import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b border-border bg-surface-raised">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="no-underline">
          <h1 className="font-heading text-3xl md:text-4xl text-text-primary tracking-tight">
            Enumerate
          </h1>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            to="/set/new"
            className="bg-primary text-white border border-primary shadow-sm rounded-[var(--radius-sm)] px-4 py-2
              font-body font-semibold text-sm transition-all duration-150 no-underline
              hover:bg-primary-hover hover:shadow-md
              active:scale-[0.98]"
          >
            + Create Set
          </Link>
          <Link
            to="/settings"
            className="bg-surface-raised text-text-primary border border-border shadow-sm rounded-[var(--radius-sm)] px-4 py-2
              font-body font-semibold text-sm transition-all duration-150 no-underline
              hover:border-border-strong hover:shadow-md
              active:scale-[0.98]"
          >
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
}
