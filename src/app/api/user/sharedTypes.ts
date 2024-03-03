import { Driver, User as PrismaUser } from "@prisma/client";

export type User = (PrismaUser & { driver?: Driver }) | undefined;
