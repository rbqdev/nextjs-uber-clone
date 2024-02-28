import { $Enums, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  const user = await prisma.user.create({});

  return NextResponse.json(
    { data: user },
    {
      status: 200,
    }
  );
}
