import { prisma } from "./client";
import { ACCOUNT_TYPE } from "./constant";

import bcrypt from "bcrypt";

const initDatabase = async () => {
  const countUser = await prisma.user.count();
  const countRole = await prisma.role.count();
  const saltRounds = 10;
  if (countUser > 0 && countRole > 0) return;
  const hashPassword = async (password: string) =>
    await bcrypt.hash(password, saltRounds);
  const defaultPassword = await hashPassword("123456");

  await prisma.role.createMany({
    data: [
      {
        name: "ADMIN",
        description: "Admin role full quyền",
      },
      {
        name: "USER",
        description: "User thông thường",
      },
    ],
  });

  const adminRole = await prisma.role.findFirst({
    where: { name: "ADMIN" },
  });

  await prisma.user.createMany({
    data: [
      {
        fullName: "User 1",
        username: "user@gmail.com",
        address: "Address 1",
        password: defaultPassword,
        accountType: ACCOUNT_TYPE.SYSTEM,
        roleId: adminRole.id,
      },
      {
        fullName: "Admin",
        username: "admin@gmail.com",
        address: "Address 2",
        password: defaultPassword,
        accountType: ACCOUNT_TYPE.SYSTEM,
        roleId: adminRole.id,
      },
    ],
  });
};

export default initDatabase;
