import React from "react";
import Link from "next/link";
import Socials from "./Socials";
import { footerLinks } from "@/constants";

function Footer() {
  return (
    <footer className="border-t py-3 dark:border-gray-800 bg-white dark:bg-transparent">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <div className="p-medium-14">© Swap Dapp</div>
        <Socials
          containerStyles="flex text-[24px] gap-x-4"
          iconStyles="text-content transition-all"
        />
        <div className="flex items-center gap-x-8">
          {footerLinks.map((link) => (
            <Link key={link.path} href={link.path} className="p-medium-14">
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
