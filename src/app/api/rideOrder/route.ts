import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/configs/prisma";
import socketClient from "@/configs/socket/client";
import { RideOrderStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  // req.json() === body on Nextj14
  const body = await req.json();

  const order = await prisma.rideOrder.create({
    data: {
      ...body,
      status: RideOrderStatus.SEARCHING,
    },
  });

  if (!order) {
    return NextResponse.json(
      { data: "Sometheing wrong!" },
      {
        status: 400,
      }
    );
  }

  // Get rider user
  const user = await prisma.rideOrder.findFirst({
    where: {
      id: order.userRiderId,
    },
  });

  socketClient.emit("toServer_newRideOrder");

  return NextResponse.json(
    { data: order },
    {
      status: 200,
    }
  );
}
