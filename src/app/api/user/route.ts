import { NextApiRequest, NextApiResponse } from "next";
import { $Enums, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

type User = {
  id: number;
  email: string;
  name: string | null;
  type: $Enums.UserType;
};

export async function GET(req: NextRequest, res: NextResponse<User>) {
  if (!req.nextUrl.search.startsWith("?email=")) {
    return NextResponse.json("Wrong param", {
      status: 401,
    });
  }
  const { searchParams } = new URL(req.nextUrl);
  const email = searchParams.get("email") ?? "";
  const user = (await prisma.user.findUnique({
    where: { email },
  })) as User;

  return NextResponse.json(
    { data: user },
    {
      status: 200,
    }
  );
}
