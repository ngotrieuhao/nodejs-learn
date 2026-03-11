import { Request, Response } from "express";
import {
  createProduct,
  getProductById,
  handleDeleteProduct,
  updateProductById,
} from "services/admin/product.service";
import { ProductSchema, TProductSchema } from "src/validation/product.schema";
import { id } from "zod/v4/locales";

const getAdminCreateProductPage = async (req: Request, res: Response) => {
  const oldData = {
    name: "",
    price: "",
    description: "",
    shortDescription: "",
    quantity: "",
    factory: "",
    target: "",
  };
  return res.render("admin/product/create", {
    errors: [],
    oldData,
  });
};

const postAdminCreateProductPage = async (req: Request, res: Response) => {
  const {
    name,
    price,
    description,
    shortDescription,
    quantity,
    factory,
    target,
  } = req.body as TProductSchema;

  const validate = ProductSchema.safeParse(req.body);
  if (!validate.success) {
    const errorsZod = validate.error.issues;
    const errors = errorsZod?.map((item) => `${item.message} ${item.path}`);
    const oldData = {
      name,
      price,
      description,
      shortDescription,
      quantity,
      factory,
      target,
    };

    const image = req.file?.filename ?? null;
    await createProduct(
      name,
      +price,
      description,
      shortDescription,
      +quantity,
      factory,
      target,
      image,
    );

    return res.render("admin/product/create", {
      errors,
      oldData,
    });
  }

  return res.redirect("/admin/product");
};

const getUpdateProductpage = async (req: Request, res: Response) => {
  const oldData = {
    name: "",
    price: "",
    description: "",
    shortDescription: "",
    quantity: "",
    factory: "",
    target: "",
  };
  return res.render("admin/update-product", {
    errors: [],
    oldData,
  });
};

const postUpdateProductpage = async (req: Request, res: Response) => {
  const {
    id,
    name,
    price,
    description,
    shortDescription,
    quantity,
    factory,
    target,
  } = req.body as TProductSchema;
  const image = req.file?.filename ?? null;
  await updateProductById(
    +id,
    name,
    +price,
    description,
    shortDescription,
    +quantity,
    factory,
    target,
    image,
  );
  return res.render("admin/product");
};

const getViewDetailProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(id.toString());

  const factoryOptions = [
    { name: "Apple (MacBook)", value: "APPLE" },
    { name: "Asus", value: "ASUS" },
    { name: "Lenovo", value: "LENOVO" },
    { name: "Dell", value: "DELL" },
    { name: "LG", value: "LG" },
    { name: "Acer", value: "ACER" },
  ];

  const targetOptions = [
    { name: "Gaming", value: "GAMING" },
    { name: "Sinh viên - Văn phòng", value: "SINHVIEN-VANPHONG" },
    { name: "Thiết kế đồ họa", value: "THIET-KE-DO-HOA" },
    { name: "Mỏng nhẹ", value: "MONG-NHE" },
    { name: "Doanh nhân", value: "DOANH-NHAN" },
  ];

  return res.render("admin/product/detail", {
    product,
    factoryOptions,
    targetOptions,
  });
};

const postDeleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await handleDeleteProduct(id.toString());
  return res.redirect("/admin/product");
};

export {
  getAdminCreateProductPage,
  postAdminCreateProductPage,
  getUpdateProductpage,
  getViewDetailProduct,
  postDeleteProduct,
  postUpdateProductpage,
};
