import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b-4 border-ink bg-white">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="no-underline">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-ink tracking-tight">
            ENUMERATE
          </h1>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            to="/set/new"
            className="bg-yellow text-ink border-3 border-ink shadow-brutal rounded px-4 py-2
              font-heading font-bold text-sm transition-all duration-100 no-underline
              hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm
              active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            + CREATE SET
          </Link>
          <Link
            to="/settings"
            className="bg-cream text-ink border-3 border-ink shadow-brutal rounded px-4 py-2
              font-heading font-bold text-sm transition-all duration-100 no-underline
              hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm
              active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
}
