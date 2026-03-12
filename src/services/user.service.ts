import { prisma } from "config/client";
import { ACCOUNT_TYPE } from "config/constant";
import bcrypt from "bcrypt";

const saltRounds = 10;
const hashPassword = async (password: string) =>
  await bcrypt.hash(password, saltRounds);

const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

const handleCreateUser = async (
  name: string,
  email: string,
  address: string,
  phone: string,
  avatar: string,
  role: string,
) => {
  const defaultPassword = await hashPassword("123456");
  await prisma.user.create({
    data: {
      fullName: name,
      username: email,
      address,
      password: defaultPassword,
      accountType: ACCOUNT_TYPE.SYSTEM,
      avatar,
      phone,
      roleId: +role,
    },
  });
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const getAllRoles = async () => {
  const roles = await prisma.role.findMany();
  return roles;
};

const handleDeleteUser = async (id: string) => {
  const deleteUser = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
  return deleteUser;
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
  return user;
};
const updateUserById = async (
  id: string,
  fullName: string,
  phone: string,
  role: string,
  address: string,
  avatar: string,
) => {
  const updateUser = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      fullName,
      address,
      phone,
      roleId: +role,
      ...(avatar !== undefined && { avatar }),
    },
  });
  return updateUser;
};

export {
  handleCreateUser,
  getAllUsers,
  handleDeleteUser,
  getUserById,
  updateUserById,
  getAllRoles,
  hashPassword,
  comparePassword,
};
