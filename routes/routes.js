import router from "express";
import { Route } from "express";

const Router = router();

Router.get("/", (req, res, next) => {
  res.render("main.ejs");
});

Router.get("/login", (req, res, next) => {
  res.render("login.ejs");
});

Router.get("/register", (req, res, next) => {
  res.render("register.ejs");
});

Router.get("/services", (req, res, next) => {
  res.render("services.ejs")
})

export default Router;
