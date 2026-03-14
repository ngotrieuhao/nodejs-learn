import { Request, Response } from "express";
import {
  createProduct,
  getProductById,
  handleDeleteProduct,
  updateProductById,
} from "services/admin/product.service";
import {
  addProductToCart,
  deleteProductFromCart,
  getOrderHistory,
  getProductInCart,
  handlerPlaceOrder,
  updateCartDetailBeforeCheckout,
} from "services/client/item.services";
import { ProductSchema, TProductSchema } from "src/validation/product.schema";

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

const postAddProductToCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as Express.User;
  if (user) {
    await addProductToCart(1, +id, user);
    return res.redirect("/cart");
  } else {
    return res.redirect("/login");
  }
};

const postDeleteProductFromCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as Express.User;
  if (user) {
    await deleteProductFromCart(+id, user.id, user.sumCart);
  } else {
    return res.redirect("/login");
  }
  return res.redirect("/cart");
};

const getCartPage = async (req: Request, res: Response) => {
  const user = req.user as Express.User;
  if (user) {
    const cartDetails = await getProductInCart(+user.id);

    const totalPrice =
      cartDetails
        ?.map((item) => +item.price * +item.quantity)
        .reduce((acc, curr) => acc + curr, 0) || 0;

    const cartId = cartDetails.length ? cartDetails[0].cartId : 0;
    return res.render("client/product/cart", {
      cartDetails,
      totalPrice,
      cartId,
    });
  } else {
    return res.redirect("/login");
  }
};

const getCheckoutPage = async (req: Request, res: Response) => {
  const user = req.user as Express.User;
  if (user) {
    const cartDetails = await getProductInCart(+user.id);

    const totalPrice =
      cartDetails
        ?.map((item) => +item.price * +item.quantity)
        .reduce((acc, curr) => acc + curr, 0) || 0;
    return res.render("client/product/checkout", { cartDetails, totalPrice });
  } else {
    return res.redirect("/login");
  }
};

const postHandleCartToCheckOut = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");
  const cartDetails = await getProductInCart(+user.id);
  const cartId = cartDetails.length ? cartDetails[0].cartId : 0;
  const currentCartDetail: { id: string; quantity: string }[] =
    req.body?.cartDetails ?? [];

  await updateCartDetailBeforeCheckout(currentCartDetail, cartId.toString());

  return res.redirect("/checkout");
};

const postPlaceOrder = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");
  const { receiverName, receiverAddress, receiverPhone, totalPrice } = req.body;

  const message = await handlerPlaceOrder(
    user.id,
    receiverName,
    receiverAddress,
    receiverPhone,
    +totalPrice,
  );
  if (message) res.redirect("/checkout");
  return res.redirect("/thanks");
};

const getThanksPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");

  return res.render("client/product/thanks");
};

const getOrderHistoryPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");
  const orders = await getOrderHistory(user.id);
  return res.render("client/product/order.history.ejs", { orders });
};

const postAddToCartFromDetailPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const user = req.user;
  if (!user) return res.redirect("/login");

  await addProductToCart(+quantity, +id, user);

  return res.redirect(`/product/${id}`);
};

export {
  getAdminCreateProductPage,
  postAdminCreateProductPage,
  getUpdateProductpage,
  getViewDetailProduct,
  postDeleteProduct,
  postAddProductToCart,
  postUpdateProductpage,
  getCartPage,
  postDeleteProductFromCart,
  getCheckoutPage,
  postHandleCartToCheckOut,
  postPlaceOrder,
  getThanksPage,
  getOrderHistoryPage,
  postAddToCartFromDetailPage,
};
