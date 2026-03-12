import { Request, Response } from "express";
import { getProductById, getProductList } from "services/admin/product.service";
import { getAllUsers } from "services/user.service";

const getDashboardPage = async (req: Request, res: Response) => {
  return res.render("admin/dashboard/show");
};

const getUserDashboardPage = async (req: Request, res: Response) => {
  const users = await getAllUsers();
  return res.render("admin/user/show", {
    users,
  });
};

const getProductDashboardPage = async (req: Request, res: Response) => {
  const products = await getProductList();
  return res.render("admin/product/show", { products });
};

const getOrderDashboardPage = async (req: Request, res: Response) => {
  return res.render("admin/order/show");
};

const getProductPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(id.toString());
  return res.render("client/product/show", { product });
};

export {
  getDashboardPage,
  getUserDashboardPage,
  getProductDashboardPage,
  getOrderDashboardPage,
  getProductPage,
};
