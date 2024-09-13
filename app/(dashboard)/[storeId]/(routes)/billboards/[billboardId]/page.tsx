import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { billboard } from "@/db/schema";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const [billboards] = await db
    .select({
      label: billboard.label,
      imageUrl: billboard.imageUrl,
    })
    .from(billboard)
    .where(eq(billboard.id, params.billboardId));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboards} />
      </div>
    </div>
  );
};

export default BillboardPage;
