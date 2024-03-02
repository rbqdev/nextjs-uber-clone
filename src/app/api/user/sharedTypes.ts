import { Driver, User } from "@prisma/client";

export type UserResponse = User & { driver?: Driver };
