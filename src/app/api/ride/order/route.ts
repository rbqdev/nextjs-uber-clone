import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/configs/prisma";
import socketClient from "@/configs/socket/client";
import { RideOrderStatus } from "@prisma/client";

/* Create RideOrder */
export async function POST(req: NextRequest) {
  const body = await req.json();

  const rideOrder = await prisma.rideOrder.create({
    data: {
      ...body,
      status: RideOrderStatus.SEARCHING,
    },
  });
  const rideUser = await prisma.user.findFirst({
    where: { id: rideOrder?.userRiderId },
  });

  if (!rideOrder) {
    return NextResponse.json(
      { data: "Sometheing wrong!" },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json(
    { data: { rideOrder, rideUser } },
    {
      status: 200,
    }
  );
}
