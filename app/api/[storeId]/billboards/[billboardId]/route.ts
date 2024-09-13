import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/drizzle";
import { billboard, stores } from "@/db/schema";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const [billboardUnique] = await db
      .select({
        id: billboard.id,
        storeId: billboard.storeId,
        label: billboard.label,
        imageUrl: billboard.imageUrl,
      })
      .from(billboard)
      .where(eq(billboard.id, params.billboardId));

    if (!billboardUnique) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    return NextResponse.json(billboardUnique);
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 401 });
    }

    if (!imageUrl) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await db
      .select({
        userId: stores.userId,
      })
      .from(stores)
      .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)));

    if (storeByUserId.length === 0) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const [billboardId] = await db
      .update(billboard)
      .set({
        label,
        imageUrl,
      })
      .where(eq(billboard.id, params.billboardId))
      .returning();

    return NextResponse.json(billboardId);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const storeByUserId = await db
      .select({
        userId: stores.userId,
      })
      .from(stores)
      .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)));

    if (storeByUserId.length === 0) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const deletedBillboard = await db
      .delete(billboard)
      .where(eq(billboard.id, params.billboardId));

    return NextResponse.json(deletedBillboard);
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
