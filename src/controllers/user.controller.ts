import { Request, Response } from "express";
import { getUserById } from "services/client/auth.service";
import { getProducts } from "services/client/item.services";
import {
  getProductWithFilter,
  userFilter,
} from "services/client/product.filter";
import {
  countTotalProductClientPages,
  countTotalProductsPage,
  getAllRoles,
  getAllUsers,
  handleCreateUser,
  handleDeleteUser,
  updateUserById,
} from "services/user.service";

const getHomePage = async (req: Request, res: Response) => {
  const { page } = req.query;

  let currentPage = page ? +page : 1;
  if (currentPage <= 0) currentPage = 1;

  const totalPages = await countTotalProductClientPages(8);

  const products = await getProducts(currentPage, 8);
  return res.render("client/home/show.ejs", {
    products,
    totalPages: +totalPages,
    page: +currentPage,
  });
};

const getProductFilterPage = async (req: Request, res: Response) => {
  const {
    page,
    factory = "",
    target = "",
    price = "",
    sort = "",
  } = req.query as {
    page?: string;
    factory: string;
    target: string;
    price: string;
    sort: string;
  };

  let currentPage = page ? +page : 1;
  if (currentPage <= 0) currentPage = 1;

  // const totalPages = await countTotalProductClientPages(6);
  // const products = await getProducts(currentPage, 6);

  const data = await getProductWithFilter(
    currentPage,
    6,
    factory,
    target,
    price,
    sort,
  );

  return res.render("client/product/filter.ejs", {
    products: data.products,
    totalPages: +data.totalPages,
    page: +currentPage,
  });
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
  getProductFilterPage,
};
