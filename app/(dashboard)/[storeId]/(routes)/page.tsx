import { db } from "@/db/drizzle";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const store = await db
    .select({
      name: stores.name,
    })
    .from(stores)
    .where(eq(stores.id, params.storeId));

  return (
    <div>
      <h1>Dashboard Page</h1>
    </div>
  );
};

export default DashboardPage;
