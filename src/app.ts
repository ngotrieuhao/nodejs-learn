import initDatabase from "config/seed";
import express from "express";
import webRoutes from "routes/web";

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

webRoutes(app);

// seeding data
initDatabase();

//404 Page
app.use((req, res) => {
  res.send("404 Not Found");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
