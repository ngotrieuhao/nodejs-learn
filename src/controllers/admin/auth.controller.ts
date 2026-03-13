import e, { Request, Response } from "express";
import { registerNewUser } from "services/client/auth.service";
import { RegisterSchema, TRegisterSchema } from "src/validation/auth.schema";

const getRegisterPage = async (req: Request, res: Response) => {
  return res.render("client/auth/register", {
    oldData: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    errors: [],
  });
};

const postRegisterPage = async (req: Request, res: Response) => {
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
    const oldData = {
      fullName,
      email,
      password,
      confirmPassword,
    };

    return res.render("client/auth/register", {
      errors,
      oldData,
    });
  }
  //success
  await registerNewUser(fullName, email, password);
  return res.redirect("/login");
};

const getLoginPage = async (req: Request, res: Response) => {
  const { session } = req as any;
  const messages = session?.messages ?? [];
  return res.render("client/auth/login", { messages });
};

const getSuccessLoginPage = async (req: Request, res: Response) => {
  const user = req.user as any;
  if (user?.role?.name === "ADMIN") {
    return res.redirect("/admin");
  } else {
    return res.redirect("/");
  }
};

const postLogoutPage = async (req: Request, res: Response, next: Function) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

export {
  getRegisterPage,
  postRegisterPage,
  getLoginPage,
  getSuccessLoginPage,
  postLogoutPage,
};
