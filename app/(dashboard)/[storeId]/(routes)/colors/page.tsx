import { format } from "date-fns";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { color } from "@/db/schema";

import { ColorsClient } from "./components/client";
import { ColorColumn } from "./components/columns";

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const colorsData = await db
    .select({
      id: color.id,
      name: color.name,
      value: color.value,
      createdAt: color.createdAt,
    })
    .from(color)
    .where(eq(color.storeId, params.storeId));

  const formattedColors: ColorColumn[] = colorsData.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
