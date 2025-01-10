import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FiMenu } from "react-icons/fi";
import NavItems from "./NavItems";

const MobileNav = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="align-middle">
          <FiMenu className="w-6 h-6 text-black dark:text-white cursor-pointer" />
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 bg-white dark:bg-gray-900 md:hidden">
          <NavItems />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
