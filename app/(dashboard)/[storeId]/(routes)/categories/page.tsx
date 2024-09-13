import { format } from "date-fns";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";

import { billboard, category, stores } from "@/db/schema";

import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await db
    .select()
    .from(category)
    .where(eq(category.storeId, params.storeId))
    .leftJoin(billboard, eq(category.billboardId, billboard.id))
    .orderBy(desc(category.createdAt));

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.category.id,
    name: item.category.name,
    billboardLabel: item.billboard?.label,
    createdAt: format(item.category.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
