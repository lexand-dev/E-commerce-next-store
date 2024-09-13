import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/drizzle";
import { size, stores } from "@/db/schema";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const [sizeUnique] = await db
      .select({
        id: size.id,
        storeId: size.storeId,
        name: size.name,
        value: size.value,
      })
      .from(size)
      .where(eq(size.id, params.sizeId));

    if (!sizeUnique) {
      return new NextResponse("Size not found", { status: 404 });
    }

    return NextResponse.json(sizeUnique);
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
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

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
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

    const [sizeId] = await db
      .update(size)
      .set({
        name,
        value,
      })
      .where(eq(size.id, params.sizeId))
      .returning();

    return NextResponse.json(sizeId);
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return new NextResponse("Internal server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
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

    const deletedSize = await db.delete(size).where(eq(size.id, params.sizeId));

    return NextResponse.json(deletedSize);
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return new NextResponse("Internal server Error", { status: 500 });
  }
}
