import { prisma } from "config/client";
import { TOTAL_ITEM_PER_PAGE } from "config/constant";

const getOrderAdmin = async (page: number) => {
  const pageSize = TOTAL_ITEM_PER_PAGE;
  const skip = (page - 1) * pageSize;
  return await prisma.order.findMany({
    include: { user: true },
    skip,
    take: pageSize,
  });
};

const getOrderDetailAdmin = async (orderId: number) => {
  return await prisma.orderDetail.findMany({
    where: { orderId },
    include: { product: true },
  });
};

export { getOrderAdmin, getOrderDetailAdmin };
