import { format } from "date-fns";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";

import { billboard } from "@/db/schema";
import { BillboardClient } from "./components/client";

import { BillboardColumn } from "./components/columns";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await db
    .select({
      id: billboard.id,
      label: billboard.label,
      createdAt: billboard.createdAt,
    })
    .from(billboard)
    .where(eq(billboard.storeId, params.storeId));

  const formattedBillboards: BillboardColumn[] = billboards.map(
    (billboard) => ({
      id: billboard.id,
      label: billboard.label,
      createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
