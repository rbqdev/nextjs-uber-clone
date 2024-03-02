import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/configs/prisma";
import socketClient from "@/configs/socket/client";
import { NextContextProps } from "../../../sharedTypes";

export async function GET(req: NextRequest, context: NextContextProps) {
  const id = Number(context.params.id);

  if (!id) {
    return NextResponse.json("Missing id", {
      status: 401,
    });
  }

  const rideOrder = await prisma.rideOrder.findFirst({
    where: { id },
  });
  const rideUser = await prisma.user.findFirst({
    where: { id: rideOrder?.userRiderId },
  });

  if (!rideOrder) {
    return NextResponse.json("User not found", {
      status: 400,
    });
  }

  return NextResponse.json(
    { data: { rideOrder, rideUser } },
    {
      status: 200,
    }
  );
}

export async function PUT(req: NextRequest, context: NextContextProps) {
  const body = await req.json();

  const rideOrder = await prisma.rideOrder.update({
    where: {
      id: Number(context.params.id),
    },
    data: body,
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
