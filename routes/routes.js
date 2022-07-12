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

Router.get("/e-commerce", (req, res, next) => {
  res.render("e-commerce.ejs")
})

Router.get("/websites", (req, res, next) => {
  res.render("websites.ejs")
})

Router.get("/mobiles", (req, res, next) => {
  res.render("mobiles.ejs")
})

Router.get("/feedback", (req, res, next) => {
  res.render("feedback.ejs")
})

Router.get("/career", (req, res, next) => {
  res.render("career.ejs")
})

Router.get("/contact", (req, res, next) => {
  res.render("contact.ejs")
})

Router.get("/about-us", (req, res, next) => {
  res.render("about-us.ejs")
})

export default Router;
