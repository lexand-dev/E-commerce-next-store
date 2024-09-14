import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/drizzle";
import { color, stores } from "@/db/schema";

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const [colorUnique] = await db
      .select({
        id: color.id,
        storeId: color.storeId,
        name: color.name,
        value: color.value,
      })
      .from(color)
      .where(eq(color.id, params.colorId));

    if (!colorUnique) {
      return new NextResponse("Color not found", { status: 404 });
    }

    return NextResponse.json(colorUnique);
  } catch (error) {
    console.log("[COLOR_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 401 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const [storeByUserId] = await db
      .select({
        userId: stores.userId,
      })
      .from(stores)
      .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)));

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const [colorId] = await db
      .update(color)
      .set({
        name,
        value,
      })
      .where(eq(color.id, params.colorId))
      .returning();

    return NextResponse.json(colorId);
  } catch (error) {
    console.log("[COLOR_PATCH]", error);
    return new NextResponse("Internal server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
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

    const deletedColor = await db
      .delete(color)
      .where(eq(color.id, params.colorId));

    return NextResponse.json(deletedColor);
  } catch (error) {
    console.log("[COLOR_DELETE]", error);
    return new NextResponse("Internal server Error", { status: 500 });
  }
}
