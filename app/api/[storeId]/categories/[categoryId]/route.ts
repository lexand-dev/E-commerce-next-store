import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/drizzle";
import { category, stores } from "@/db/schema";

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const [categoryUnique] = await db
      .select()
      .from(category)
      .where(eq(category.id, params.categoryId));

    if (!categoryUnique) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return NextResponse.json(categoryUnique);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 401 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
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

    const [categoryUpdate] = await db
      .update(category)
      .set({
        name,
        billboardId,
      })
      .where(eq(category.id, params.categoryId))
      .returning();

    return NextResponse.json(categoryUpdate);
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
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

    const deletedCategory = await db
      .delete(category)
      .where(eq(category.id, params.categoryId));

    return NextResponse.json(deletedCategory);
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
