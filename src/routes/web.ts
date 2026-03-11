import express, { Express } from "express";
import {
  getCreateUserPage,
  getHomePage,
  getViewDetailUser,
  postCreateUserPage,
  postDeleteUserPage,
  postUpdateUser,
} from "../controllers/user.controller";
import {
  getDashboardPage,
  getOrderDashboardPage,
  getProductDashboardPage,
  getProductPage,
  getUserDashboardPage,
} from "controllers/admin/dashboard.controller";
import fileUploadMiddleware from "src/middleware/multer";

const router = express.Router();

const webRoutes = (app: Express) => {
  router.get("/", getHomePage);
  router.get("/product/:id", getProductPage);

  router.get("/admin", getDashboardPage);
  router.get("/admin/user", getUserDashboardPage);
  router.get("/admin/product", getProductDashboardPage);
  router.get("/admin/order", getOrderDashboardPage);
  router.get("/admin/create", getCreateUserPage);
  router.post(
    "/admin/handle-create-user",
    fileUploadMiddleware("avatar"),
    postCreateUserPage,
  );
  router.post("/admin/delete-user/:id", postDeleteUserPage);
  router.get("/admin/view-user/:id", getViewDetailUser);
  router.post(
    "/admin/update-user",
    fileUploadMiddleware("avatar"),
    postUpdateUser,
  );

  app.use("/", router);
};

export default webRoutes;
