import { NextApiRequest, NextApiResponse } from "next";
import { UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/configs/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.nextUrl);
  const type = (searchParams.get("type") ?? "") as UserType;

  if (!type) {
    return NextResponse.json("Missing type param", {
      status: 401,
    });
  }

  const user = await prisma.user.findFirst({
    where: { type },
  });

  if (!user) {
    return NextResponse.json("User not found", {
      status: 400,
    });
  }

  return NextResponse.json(
    { data: user },
    {
      status: 200,
    }
  );
}
