import { db } from "@/db/drizzle";
import { stores } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [store] = await db
    .select({
      id: stores.id,
    })
    .from(stores)
    .where(eq(stores.userId, userId));

  if (store) {
    redirect(`/${store.id}`);
  }

  return <div className="grid grid-cols-12 gap-6">{children}</div>;
}
