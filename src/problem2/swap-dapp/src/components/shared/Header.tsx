import Link from "next/link";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";
import ModeToggle from "./ModeToggle";
import Logo from "@/components/shared/Logo";

const Header = () => {
  return (
    <header className="w-full border-b dark:border-gray-800 bg-white dark:bg-transparent">
      <div className="max-w-7xl lg:mx-auto p-3 md:px-10 xl:px-0 w-full flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden md:flex w-full max-w-xs">
          <NavItems />
        </nav>{" "}
        <div className="flex justify-end gap-3 items-center">
          <ModeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
