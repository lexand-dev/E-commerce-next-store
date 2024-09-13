import { size, stores } from "@/db/schema";
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

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value URL is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await db
      .select({
        userId: stores.userId,
      })
      .from(stores)
      .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)));

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const [createSize] = await db
      .insert(size)
      .values({
        id: createId(),
        name,
        value,
        storeId: params.storeId,
      })
      .returning();

    return NextResponse.json(createSize);
  } catch (error) {
    console.log("[SIZES_POST]", error);
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

    const sizes = await db
      .select({
        id: size.id,
        storeId: size.storeId,
        name: size.name,
        value: size.value,
      })
      .from(size)
      .where(eq(size.storeId, params.storeId));

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[SIZES_GET", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
