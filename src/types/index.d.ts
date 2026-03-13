import { Role, User as UserPrisma } from "@prisma/client";

type UserRole = User & Role;

declare global {
  namespace Express {
    interface User extends UserPrisma {
      role?: Role;
      sumCart?: number;
    }
  }
}
