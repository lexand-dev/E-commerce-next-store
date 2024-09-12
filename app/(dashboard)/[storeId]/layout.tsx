import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { stores } from "@/db/schema";
import Navbar from "@/components/navbar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [store] = await db
    .select({
      name: stores.name,
    })
    .from(stores)
    .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)));
  console.log(store);

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
