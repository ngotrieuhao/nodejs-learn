import { prisma } from "config/client";

const getProducts = async () => {
  const products = await prisma.product.findMany();
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
          decrement: 1,
        },
      },
    });
  }
};
export {
  getProducts,
  addProductToCart,
  getProductInCart,
  deleteProductFromCart,
};
