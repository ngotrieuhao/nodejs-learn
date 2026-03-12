import { prisma } from "config/client";
import { ACCOUNT_TYPE } from "config/constant";
import { hash } from "crypto";
import { hashPassword } from "services/user.service";

const isEmailExist = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      username: email,
    },
  });
  if (user) {
    return true;
  }
  return false;
};

const registerNewUser = async (
  fullName: string,
  email: string,
  password: string,
) => {
  const newPassword = await hashPassword(password);
  const userRole = await prisma.role.findUnique({
    where: {
      name: "USER",
    },
  });
  if (userRole) {
    await prisma.user.create({
      data: {
        fullName,
        username: email,
        password: newPassword,
        accountType: ACCOUNT_TYPE.SYSTEM,
        roleId: userRole.id,
      },
    });
  } else {
    throw new Error("Role USER not found in the database");
  }
};

export { isEmailExist, registerNewUser };
