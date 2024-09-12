import { stores } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { createId } from "@paralleldrive/cuid2";
import { NextResponse } from "next/server";

import { db } from "@/db/drizzle";

export async function GET() {
  return NextResponse.json({
    hola: "mundo",
  });
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const [store] = await db
      .insert(stores)
      .values({
        id: createId(),
        name,
        userId,
      })
      .returning();

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORES_POST", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
