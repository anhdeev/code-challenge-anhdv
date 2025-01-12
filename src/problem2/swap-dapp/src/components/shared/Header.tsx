"use client";
import Link from "next/link";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";
import ModeToggle from "./ModeToggle";
import Image from "next/image";
import WalletConnect from "@/components/wallet/WalletConnect";

const Header = () => {
  return (
    <header className="w-full border-b dark:border-gray-800 bg-white dark:bg-transparent">
      <div className="max-w-7xl lg:mx-auto p-3 md:px-10 xl:px-0 w-full flex items-center justify-between">
        <Link href="/">
          <Image src="/vercel.svg" alt="logo" width={24} height={24} />
        </Link>
        <nav className="hidden md:flex w-full max-w-xs">
          <NavItems />
        </nav>
        <WalletConnect />
        <div className="flex justify-end gap-3 items-center">
          <ModeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
