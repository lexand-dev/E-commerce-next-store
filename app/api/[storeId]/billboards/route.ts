import { billboard, stores } from "@/db/schema";
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

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
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

    console.log(storeByUserId);

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const [billboards] = await db
      .insert(billboard)
      .values({
        id: createId(),
        label,
        imageUrl,
        storeId: params.storeId,
      })
      .returning();

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
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

    const billboards = await db
      .select({
        id: billboard.id,
        storeId: billboard.storeId,
        label: billboard.label,
        imageUrl: billboard.imageUrl,
      })
      .from(billboard)
      .where(eq(billboard.storeId, params.storeId));

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
