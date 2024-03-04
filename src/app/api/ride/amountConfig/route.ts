import { NextResponse } from "next/server";
import { prisma } from "@/configs/prisma";

export async function GET() {
  const rideAmountConfig = await prisma.rideAmountConfig.findFirst();

  if (!rideAmountConfig) {
    return NextResponse.json("Config not found", {
      status: 400,
    });
  }

  return NextResponse.json(
    { data: rideAmountConfig },
    {
      status: 200,
    }
  );
}
