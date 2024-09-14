import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { color } from "@/db/schema";
import { ColorForm } from "./components/color-form";

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  const [colorData] = await db
    .select({
      id: color.id,
      name: color.name,
      value: color.value,
      createdAt: color.createdAt,
    })
    .from(color)
    .where(eq(color.id, params.colorId));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={colorData} />
      </div>
    </div>
  );
};

export default ColorPage;
