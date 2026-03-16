import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const checkValidJWT = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path;
  const whiteList = ["/add-product-to-cart", "/login"];
  const isWhiteList = whiteList.some((route) => route === path);
  if (isWhiteList === true) {
    next();
    return;
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader?.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      username: decoded.username,
      password: "",
      fullName: "",
      address: "",
      phone: "",
      accountType: decoded.accountType,
      avatar: decoded.avatar,
      roleId: decoded.roleId,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({ data: null, error: "Unauthorized" });
  }
};

export { checkValidJWT };
