import { prisma } from "config/client";

const getProducts = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const products = await prisma.product.findMany({
    skip: skip,
    take: pageSize,
  });
  return products;
};

const addProductToCart = async (
  quantity: number,
  productId: number,
  user: Express.User,
) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId: user.id,
    },
  });

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (cart) {
    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        sum: {
          increment: quantity,
        },
      },
    });

    const currentCartDetail = await prisma.cartDetail.findFirst({
      where: {
        productId,
        cartId: cart.id,
      },
    });
    await prisma.cartDetail.upsert({
      where: {
        id: currentCartDetail?.id ?? 0,
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        price: product?.price ?? 0,
        quantity,
        productId,
        cartId: cart.id,
      },
    });
  } else {
    await prisma.cart.create({
      data: {
        sum: quantity,
        userId: user.id,
        cartDetails: {
          create: [
            {
              price: product.price,
              quantity,
              productId,
            },
          ],
        },
      },
    });
  }
};

const getProductInCart = async (userId: number) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });
  if (cart) {
    const currentCartDetails = await prisma.cartDetail.findMany({
      where: {
        cartId: cart.id,
      },
      include: {
        product: true,
      },
    });
    return currentCartDetails;
  }
  return [];
};

const deleteProductFromCart = async (
  cartDetailId: number,
  userId: number,
  sumCart: number,
) => {
  const currentCardDetail = await prisma.cartDetail.findUnique({
    where: {
      id: cartDetailId,
    },
  });
  const quantity = currentCardDetail?.quantity ?? 0;

  await prisma.cartDetail.delete({
    where: {
      id: cartDetailId,
    },
  });
  if (sumCart === 1) {
    await prisma.cart.delete({
      where: {
        userId,
      },
    });
  } else {
    await prisma.cart.update({
      where: {
        userId,
      },
      data: {
        sum: {
          decrement: quantity,
        },
      },
    });
  }
};

const updateCartDetailBeforeCheckout = async (
  data: { id: string; quantity: string }[],
  cartId: string,
) => {
  let quantity = 0;

  for (let i = 0; i < data.length; i++) {
    quantity += +data[i].quantity;
    await prisma.cartDetail.update({
      where: {
        id: +data[i].id,
      },
      data: {
        quantity: +data[i].quantity,
      },
    });
  }

  //update cart sum
  await prisma.cart.update({
    where: {
      id: +cartId,
    },
    data: {
      sum: quantity,
    },
  });
};

const handlerPlaceOrder = async (
  userId: number,
  receiverName: string,
  receiverAddress: string,
  receiverPhone: string,
  totalPrice: number,
) => {
  try {
    prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          cartDetails: true,
        },
      });

      if (cart) {
        //create order
        const dataOrderDetail =
          cart?.cartDetails?.map((item) => ({
            price: item.price,
            quantity: item.quantity,
            productId: item.productId,
          })) ?? [];

        await tx.order.create({
          data: {
            receiverName,
            receiverAddress,
            receiverPhone,
            paymentMethod: "COD",
            paymentStatus: "PAYMENT_UNPAID",
            status: "PENDING",
            totalPrice: totalPrice,
            userId,
            orderDetails: {
              create: dataOrderDetail,
            },
          },
        });

        //remove cart detail + cart
        await tx.cartDetail.deleteMany({
          where: { cartId: cart.id },
        });

        await tx.cart.delete({
          where: { id: cart.id },
        });

        // check product
        for (let i = 0; i < cart.cartDetails.length; i++) {
          const productId = cart.cartDetails[i].productId;
          const product = await tx.product.findUnique({
            where: {
              id: productId,
            },
          });

          if (!product || product.quantity < cart.cartDetails[i].quantity) {
            throw new Error(`Product ${product?.name} is not valid`);
          }

          await tx.product.update({
            where: {
              id: productId,
            },
            data: {
              quantity: {
                decrement: cart.cartDetails[i].quantity,
              },
              sold: {
                increment: cart.cartDetails[i].quantity,
              },
            },
          });
        }
      }
    });
  } catch (error) {
    return error.message;
  }
};

const getOrderHistory = async (userId: number) => {
  return await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      orderDetails: {
        include: {
          product: true,
        },
      },
    },
  });
};

export {
  getProducts,
  addProductToCart,
  getProductInCart,
  deleteProductFromCart,
  updateCartDetailBeforeCheckout,
  handlerPlaceOrder,
  getOrderHistory,
};
