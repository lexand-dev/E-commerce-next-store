import { UserButton } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const storeItems = await db
    .select({
      name: stores.name,
      id: stores.id,
    })
    .from(stores)
    .where(eq(stores.userId, userId));

  return (
    <div className="border-b">
      <div className="h-16 px-4 flex items-center">
        <StoreSwitcher items={storeItems} className="mr-4" />
        <MainNav className="mx-4" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
