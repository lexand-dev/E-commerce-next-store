import { UserButton } from "@clerk/nextjs";
import { MainNav } from "./main-nav";

const Navbar = () => {
  return (
    <div className="border-b">
      <div className="h-16 px-4 flex items-center">
        <div>switcher here</div>
        <MainNav className="mx-4" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
