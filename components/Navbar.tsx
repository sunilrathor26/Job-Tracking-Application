import ThemeToggle from "../components/ThemeToggle";
import { UserButton } from "@clerk/nextjs";
import LinksDropdown from "../components/LinksDropdown";

function Navbar() {
  return (
    <nav className="bg-muted px-4 sm:px-16 lg:px-24 flex h-14 items-center justify-between">
      <div>
        <LinksDropdown />
      </div>
      <div className="flex items-center gap-x-4">
        <ThemeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}

export default Navbar;
