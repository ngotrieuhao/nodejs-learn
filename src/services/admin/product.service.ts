import { prisma } from "config/client";
import { TOTAL_ITEM_PER_PAGE } from "config/constant";

const createProduct = async (
  name: string,
  price: number,
  description: string,
  shortDescription: string,
  quantity: number,
  factory: string,
  target: string,
  image: string | null,
) => {
  const product = await prisma.product.create({
    data: {
      name,
      price,
      description,
      shortDescription,
      quantity,
      factory,
      target,
      ...(image && { image: image }),
    },
  });
};

const getProductList = async (page: number) => {
  const pageSize = TOTAL_ITEM_PER_PAGE;
  const skip = (page - 1) * pageSize;
  return await prisma.product.findMany({
    skip,
    take: pageSize,
  });
};

const handleDeleteProduct = async (id: string) => {
  const deleteProduct = await prisma.product.delete({
    where: {
      id: Number(id),
    },
  });
  return deleteProduct;
};

const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
  });
  return product;
};

const updateProductById = async (
  id: number,
  name: string,
  price: number,
  description: string,
  shortDescription: string,
  quantity: number,
  factory: string,
  target: string,
  image: string | null,
) => {
  await prisma.product.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
      price,
      description,
      shortDescription,
      quantity,
      factory,
      target,
      ...(image && { image: image }),
    },
  });
};

export {
  createProduct,
  getProductList,
  handleDeleteProduct,
  getProductById,
  updateProductById,
};
