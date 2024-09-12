import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { stores } from "@/db/schema";
import { db } from "@/db/drizzle";
import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
  params: { storeId: string };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const [store] = await db
    .select({
      name: stores.name,
    })
    .from(stores)
    .where(eq(stores.id, params.storeId));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
