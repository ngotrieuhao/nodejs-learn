/// <reference path="./types/index.d.ts" />
import initDatabase from "config/seed";
import express from "express";
import passport from "passport";
import webRoutes from "routes/web";
import { configPassportLocal } from "./middleware/passport.local";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "config/client";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

//config session
app.use(
  session({
    secret: "default_secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);
// config passport
app.use(passport.initialize());
app.use(passport.authenticate("session"));
configPassportLocal();

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
webRoutes(app);

// seeding data
initDatabase();
//404 Page
app.use((req, res) => {
  res.render("status/404");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
