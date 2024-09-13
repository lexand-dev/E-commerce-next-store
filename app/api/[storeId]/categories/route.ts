import { billboard, category, stores } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { createId } from "@paralleldrive/cuid2";
import { NextResponse } from "next/server";

import { db } from "@/db/drizzle";
import { and, eq } from "drizzle-orm";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const [storeByUserId] = await db
      .select({
        userId: stores.userId,
      })
      .from(stores)
      .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)));

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const [createCategory] = await db
      .insert(category)
      .values({
        id: createId(),
        name,
        billboardId,
        storeId: params.storeId,
      })
      .returning();

    return NextResponse.json(createCategory);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const categories = await db
      .select()
      .from(category)
      .where(eq(category.storeId, params.storeId));

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[BILLBOARDS_GET", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
