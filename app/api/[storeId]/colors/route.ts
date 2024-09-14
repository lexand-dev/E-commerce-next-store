import { color, stores } from "@/db/schema";
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

    const [createColor] = await db
      .insert(color)
      .values({
        id: createId(),
        name,
        value,
        storeId: params.storeId,
      })
      .returning();

    return NextResponse.json(createColor);
  } catch (error) {
    console.log("[COLORS_POST]", error);
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

    const colors = await db
      .select({
        id: color.id,
        storeId: color.storeId,
        name: color.name,
        value: color.value,
      })
      .from(color)
      .where(eq(color.storeId, params.storeId));

    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLORS_GET", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
