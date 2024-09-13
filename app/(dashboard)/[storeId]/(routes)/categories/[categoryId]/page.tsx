import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { billboard, category } from "@/db/schema";
import { CategoryForm } from "./components/category-form";

const BillboardPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const [categoryUnique] = await db
    .select({
      name: category.name,
      billboardId: category.billboardId,
    })
    .from(category)
    .where(eq(category.id, params.categoryId));

  const billboards = await db
    .select()
    .from(billboard)
    .where(eq(billboard.storeId, params.storeId));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={categoryUnique} />
      </div>
    </div>
  );
};

export default BillboardPage;
