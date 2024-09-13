import { format } from "date-fns";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { size } from "@/db/schema";

import { SizesClient } from "./components/client";
import { SizeColumn } from "./components/columns";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizesData = await db
    .select({
      id: size.id,
      name: size.name,
      value: size.value,
      createdAt: size.createdAt,
    })
    .from(size)
    .where(eq(size.storeId, params.storeId));

  const formattedSizes: SizeColumn[] = sizesData.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
