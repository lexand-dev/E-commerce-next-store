import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { size } from "@/db/schema";
import { SizeForm } from "./components/size-form";

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  const [sizeData] = await db
    .select({
      id: size.id,
      name: size.name,
      value: size.value,
      createdAt: size.createdAt,
    })
    .from(size)
    .where(eq(size.id, params.sizeId));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={sizeData} />
      </div>
    </div>
  );
};

export default SizePage;
