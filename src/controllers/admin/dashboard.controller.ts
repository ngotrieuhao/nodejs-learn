import { Request, Response } from "express";
import { getDashboardInfo } from "services/admin/dashboard.service";
import {
  getOrderAdmin,
  getOrderDetailAdmin,
} from "services/admin/order.service";
import { getProductById, getProductList } from "services/admin/product.service";
import {
  countTotalOrdersPage,
  countTotalProductsPage,
  countTotalUsersPage,
  getAllUsers,
} from "services/user.service";

const getDashboardPage = async (req: Request, res: Response) => {
  const info = await getDashboardInfo();
  return res.render("admin/dashboard/show", { info });
};

const getUserDashboardPage = async (req: Request, res: Response) => {
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage < 1) currentPage = 1;

  const totalPages = await countTotalUsersPage();
  const users = await getAllUsers(currentPage);

  return res.render("admin/user/show", {
    users,
    totalPages,
    page: currentPage,
  });
};

const getProductDashboardPage = async (req: Request, res: Response) => {
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage < 1) currentPage = 1;

  const totalPages = await countTotalProductsPage();

  const products = await getProductList(currentPage);
  return res.render("admin/product/show", {
    products,
    totalPages,
    page: currentPage,
  });
};

const getProductPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(id.toString());
  return res.render("client/product/show", { product });
};

const getAdminOrderPage = async (req: Request, res: Response) => {
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage < 1) currentPage = 1;
  const totalPages = await countTotalOrdersPage();

  const orders = await getOrderAdmin(currentPage);
  return res.render("admin/order/show.ejs", {
    orders,
    totalPages,
    page: currentPage,
  });
};

const getAdminOrderDetailPage = async (req: Request, res: Response) => {
  const { id } = req.params;

  const orderDetails = await getOrderDetailAdmin(+id);

  return res.render("admin/order/detail.ejs", {
    orderDetails,
    id,
  });
};

export {
  getDashboardPage,
  getUserDashboardPage,
  getProductDashboardPage,
  getProductPage,
  getAdminOrderPage,
  getAdminOrderDetailPage,
};
