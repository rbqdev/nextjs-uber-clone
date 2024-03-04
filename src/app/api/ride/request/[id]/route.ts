import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/configs/prisma";
import { NextContextProps } from "../../../sharedTypes";

export async function GET(req: NextRequest, context: NextContextProps) {
  const id = Number(context.params.id);

  if (!id) {
    return NextResponse.json("Missing id", {
      status: 401,
    });
  }

  const rideRequest = await prisma.rideRequest.findFirst({
    where: { id },
  });
  const rider = await prisma.user.findFirst({
    where: { id: rideRequest?.riderId },
  });

  if (!rideRequest) {
    return NextResponse.json("User not found", {
      status: 404,
    });
  }

  return NextResponse.json(
    { data: { rideRequest, rider } },
    {
      status: 200,
    }
  );
}

export async function PUT(req: NextRequest, context: NextContextProps) {
  const body = await req.json();

  const rideRequest = await prisma.rideRequest.update({
    where: {
      id: Number(context.params.id),
    },
    data: body,
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
