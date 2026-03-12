import { Request, Response } from "express";
import { getProducts } from "services/client/item.services";
import {
  getAllRoles,
  getAllUsers,
  getUserById,
  handleCreateUser,
  handleDeleteUser,
  updateUserById,
} from "services/user.service";

const getHomePage = async (req: Request, res: Response) => {
  const products = await getProducts();
  return res.render("client/home/show", { products });
};

const getCreateUserPage = async (req: Request, res: Response) => {
  const getRoles = await getAllRoles();
  return res.render("admin/user/create", {
    roles: getRoles,
  });
};

const postCreateUserPage = async (req: Request, res: Response) => {
  const { fullName, username, phone, role, address } = req.body;
  const file = req.file as Express.Multer.File;
  const avatar = file?.filename ?? "";
  const a = await handleCreateUser(
    fullName,
    username,
    address,
    phone,
    avatar,
    role,
  );
  return res.redirect("/admin/user");
};

const postDeleteUserPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  await handleDeleteUser(id.toString());
  return res.redirect("/admin/user");
};

const getViewDetailUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getUserById(id.toString());
  const getRoles = await getAllRoles();

  return res.render("admin/user/detail", { id, user, roles: getRoles });
};

const postUpdateUser = async (req: Request, res: Response) => {
  const { id, fullName, phone, role, address } = req.body;
  const file = req.file as Express.Multer.File;
  const avatar = file?.filename ?? undefined;
  await updateUserById(
    id.toString(),
    fullName.toString(),
    phone.toString(),
    role.toString(),
    address.toString(),
    avatar,
  );
  return res.redirect("/admin/user");
};

export {
  getHomePage,
  getCreateUserPage,
  postCreateUserPage,
  postDeleteUserPage,
  getViewDetailUser,
  postUpdateUser,
};
