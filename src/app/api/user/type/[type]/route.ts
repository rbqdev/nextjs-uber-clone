import { NextApiRequest, NextApiResponse } from "next";
import { UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/configs/prisma";
import { NextContextProps } from "../../../sharedTypes";

export async function GET(req: NextRequest, context: NextContextProps) {
  const type = context.params.type;

  if (!type) {
    return NextResponse.json("Missing type param", {
      status: 401,
    });
  }

  const user = await prisma.user.findFirst({
    relationLoadStrategy: "join",
    where: { type },
    include: {
      driver: type === UserType.DRIVER,
    },
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
