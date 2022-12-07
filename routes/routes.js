import router from "express";
import { Route, raw } from "express";
import {
  getuser,
  isAdmin,
  logout,
  postLogin,
  postRegister,
  verifyActiveSession,
} from "../controllers/auth.js";
import { postContact } from "../controllers/user.js";
import { postAddUser, getUsers } from "../controllers/admin.js";
import { getFeedback, postFeedback } from "../controllers/feedback.js";

const Router = router();

Router.get("/", (req, res, next) => {
  res.render("main.ejs", {isLoggedIn: req.session.user});
});

Router.get("/login", (req, res, next) => {
  res.render("login.ejs", {isLoggedIn: req.session.user});
});

Router.get("/register", (req, res, next) => {
  res.render("register.ejs", {isLoggedIn: req.session.user});
});

Router.get("/services", (req, res, next) => {
  res.render("services.ejs", {isLoggedIn: req.session.user});
});

Router.get("/e-commerce", (req, res, next) => {
  res.render("e-commerce.ejs", {isLoggedIn: req.session.user});
});

Router.get("/websites", (req, res, next) => {
  res.render("websites.ejs", {isLoggedIn: req.session.user});
});

Router.get("/mobiles", (req, res, next) => {
  res.append("x-ctf-flag", "ctf{th4t_w4s_3asy}");
  res.render("mobiles.ejs", {isLoggedIn: req.session.user});
});

Router.get("/career", (req, res, next) => {
  res.render("career.ejs", {isLoggedIn: req.session.user});
});

Router.get("/contact", (req, res, next) => {
  res.render("contact.ejs", {isLoggedIn: req.session.user});
});

Router.get("/about-us", (req, res, next) => {
  res.render("about-us.ejs", {isLoggedIn: req.session.user});
});

Router.get("/robots.txt", (req, res, next) => {
  res.write("ctf{lik3_mr_r0b0t}");
  res.end();
});

Router.get("/logout", verifyActiveSession, logout, (req, res, next) => {
  res.render("main.ejs", {isLoggedIn: req.session.user});
});

Router.get("/user", verifyActiveSession, getuser);

Router.post("/addUser", verifyActiveSession, isAdmin);

Router.get("/users", getUsers);

Router.get("/feedback", getFeedback);

Router.post("/login", postLogin);

Router.post("/feedback", postFeedback)

Router.post("/register", postRegister);

Router.post(
  "/contact",
  raw({ type: ["application/json", "application/xml", "text/xml"] }),
  postContact
);

Router.get("/admin", verifyActiveSession, isAdmin);

export default Router;
