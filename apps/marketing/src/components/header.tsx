import Link from "next/link";

import { ModeToggle } from "./mode-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
] as const;

const Header = () => (
  <header className="border-b">
    <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
      <Link className="text-lg font-semibold tracking-tight" href="/">
        doresume
      </Link>
      <nav className="flex items-center gap-4">
        {links.map(({ href, label }) => (
          <Link
            className="text-muted-foreground hover:text-foreground text-sm"
            href={href}
            key={href}
          >
            {label}
          </Link>
        ))}
        <ModeToggle />
      </nav>
    </div>
  </header>
);

export default Header;
