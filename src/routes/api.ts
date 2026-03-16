import { postAddProductToCart } from "controllers/admin/product.controller";
import {
  createUserAPI,
  deleteUserById,
  fetchAccountAPI,
  getAllUsersAPI,
  getUserByIdAPI,
  loginAPI,
  updateUserById,
} from "controllers/client/api.controller";
import express, { Express } from "express";
import { checkValidJWT } from "src/middleware/jwt.middleware";

const router = express.Router();

const apiRoutes = (app: Express) => {
  router.post("/add-product-to-cart", postAddProductToCart);
  router.get("/users", getAllUsersAPI);
  router.get("/users/:id", getUserByIdAPI);
  router.post("/users", createUserAPI);
  router.put("/users/:id", updateUserById);
  router.delete("/users/:id", deleteUserById);

  router.post("/login", loginAPI);

  router.get("/account", fetchAccountAPI);

  app.use("/api", checkValidJWT, router);
};

export default apiRoutes;
