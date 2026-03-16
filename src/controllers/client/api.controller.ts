import { Request, Response } from "express";
import {
  handleDeleteUserById,
  handleGetAllUser,
  handleGetUserById,
  handleLoginAPI,
  handleUpdateUserById,
} from "services/client/api.service";
import { registerNewUser } from "services/client/auth.service";
import { addProductToCart } from "services/client/item.services";
import { RegisterSchema, TRegisterSchema } from "src/validation/auth.schema";
import { da } from "zod/v4/locales";

const postAddProductToCartAPI = async (req: Request, res: Response) => {
  const { quantity, productId } = req.body;
  const user = req.user;

  const currentSum = req?.user?.sumCart ?? 0;
  const newSum = currentSum + +quantity;

  await addProductToCart(+quantity, +productId, user);

  res.status(200).json({
    data: newSum,
  });
};

const getAllUsersAPI = async (req: Request, res: Response) => {
  const users = await handleGetAllUser();
  const user = req.user;
  res.status(200).json({
    data: users,
  });
};

const getUserByIdAPI = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await handleGetUserById(+id);
  res.status(200).json({
    data: user,
  });
};

const createUserAPI = async (req: Request, res: Response) => {
  const { fullName, email, password, confirmPassword } =
    req.body as TRegisterSchema;

  const validate = await RegisterSchema.safeParseAsync({
    fullName,
    email,
    password,
    confirmPassword,
  });
  if (!validate.success) {
    const errorsZod = validate.error.issues;
    const errors = errorsZod.map(
      (item) => `${item.message} (${item.path.join("")}) `,
    );

    res.status(400).json({
      errors,
    });
    return;
  }

  //success
  await registerNewUser(fullName, email, password);
  res.status(201).json({
    data: "User created successfully",
    message: "User created successfully",
  });
};

const updateUserById = async (req: Request, res: Response) => {
  const { fullName, phone, address } = req.body;
  const { id } = req.params;
  await handleUpdateUserById(+id, fullName, phone, address);
  res.status(200).json({
    data: "User updated successfully",
  });
};

const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  await handleDeleteUserById(+id);
  res.status(200).json({
    data: "User deleted successfully",
  });
};

const loginAPI = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const access_token = await handleLoginAPI(username, password);
    res.status(200).json({
      data: {
        access_token,
      },
    });
  } catch (error) {
    res.status(401).json({
      data: null,
      error: error.message,
    });
  }
};

const fetchAccountAPI = async (req: Request, res: Response) => {
  const user = req.user;
  res.status(200).json({
    data: {
      user,
    },
  });
};

export {
  postAddProductToCartAPI,
  getAllUsersAPI,
  getUserByIdAPI,
  createUserAPI,
  updateUserById,
  deleteUserById,
  loginAPI,
  fetchAccountAPI,
};
