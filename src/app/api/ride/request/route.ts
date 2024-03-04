import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/configs/prisma";
import { RideRequestStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const rideRequest = await prisma.rideRequest.create({
    data: {
      ...body,
      status: RideRequestStatus.SEARCHING,
    },
  });
  const rider = await prisma.user.findFirst({
    where: { id: rideRequest?.riderId },
  });

  if (!rideRequest) {
    return NextResponse.json(
      { data: "Sometheing wrong!" },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json(
    { data: { rideRequest, rider } },
    {
      status: 200,
    }
  );
}
