"use client";

import { headerLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavItems = () => {
  const pathname = usePathname();

  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
      {headerLinks.map((link) => {
        const isActive = pathname === link.path;

        return (
          <li
            key={link.path}
            className={`${
              isActive && "text-primary-500"
            } flex-center p-medium-14 whitespace-nowrap`}
          >
            <Link href={link.path}>{link.name}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
