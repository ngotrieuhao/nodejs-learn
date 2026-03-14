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
  getAdminOrderDetailPage,
  getAdminOrderPage,
  getDashboardPage,
  getOrderDashboardPage,
  getProductDashboardPage,
  getProductPage,
  getUserDashboardPage,
} from "controllers/admin/dashboard.controller";
import fileUploadMiddleware from "src/middleware/multer";
import {
  getAdminCreateProductPage,
  getCartPage,
  getCheckoutPage,
  getOrderHistoryPage,
  getThanksPage,
  getUpdateProductpage,
  getViewDetailProduct,
  postAddProductToCart,
  postAddToCartFromDetailPage,
  postAdminCreateProductPage,
  postDeleteProduct,
  postDeleteProductFromCart,
  postHandleCartToCheckOut,
  postPlaceOrder,
} from "controllers/admin/product.controller";
import {
  getLoginPage,
  getRegisterPage,
  getSuccessLoginPage,
  postLogoutPage,
  postRegisterPage,
} from "controllers/admin/auth.controller";
import passport from "passport";
import { isAdmin, isLogin } from "src/middleware/auth";

const router = express.Router();

const webRoutes = (app: Express) => {
  router.get("/", getHomePage);
  router.get("/product/:id", getProductPage);

  router.get("/admin", isAdmin, getDashboardPage);
  router.get("/admin/user", getUserDashboardPage);

  router.post("/add-product-to-cart/:id", postAddProductToCart);
  router.post("/delete-product-from-cart/:id", postDeleteProductFromCart);

  router.get("/admin/product", getProductDashboardPage);
  router.get("/admin/create-product", getAdminCreateProductPage);
  router.post(
    "/admin/create-product",
    fileUploadMiddleware("image", "images/product"),
    postAdminCreateProductPage,
  );
  router.get("/admin/update-product", getUpdateProductpage);
  router.post(
    "/admin/update-product",
    fileUploadMiddleware("image", "images/product"),
    getUpdateProductpage,
  );
  router.get("/admin/view-product/:id", getViewDetailProduct);
  router.post("/admin/delete-product/:id", postDeleteProduct);

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
  router.get("/admin/order", getAdminOrderPage);
  router.get("/admin/order/:id", getAdminOrderDetailPage);

  router.get("/success-login", getSuccessLoginPage);
  router.get("/login", getLoginPage);
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/success-login",
      failureRedirect: "/login",
      failureMessage: true,
    }),
  );
  router.get("/register", getRegisterPage);
  router.post("/register", postRegisterPage);
  router.post("/logout", postLogoutPage);
  router.get("/cart", getCartPage);
  router.get("/checkout", getCheckoutPage);
  router.post("/handle-cart-to-checkout", postHandleCartToCheckOut);
  router.post("/place-order", postPlaceOrder);
  router.get("/thanks", getThanksPage);
  router.get("/order-history", getOrderHistoryPage);
  router.post("/add-to-cart-from-detail-page/:id", postAddToCartFromDetailPage);

  app.use("/", isAdmin, router);
};

export default webRoutes;
