import { NextApiRequest, NextApiResponse } from "next";
import { UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/configs/prisma";
import { NextContextProps } from "../../../sharedTypes";

export async function GET(req: NextRequest, context: NextContextProps) {
  const id = Number(context.params.id);

  if (!id) {
    return NextResponse.json("Missing type param", {
      status: 401,
    });
  }

  const user = await prisma.user.findFirst({
    relationLoadStrategy: "join",
    where: { id },
    include: {
      driver: true,
    },
  });

  if (!user) {
    return NextResponse.json("User not found", {
      status: 404,
    });
  }

  return NextResponse.json(
    { data: user },
    {
      status: 200,
    }
  );
}
