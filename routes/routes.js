import router from "express";
import process from "node:process";
import { raw } from "express";
import {
  isAdmin,
  logout,
  postLogin,
  postRegister,
  verifyActiveSession,
} from "../controllers/auth.js";
import {
  postContact,
  getFeedback,
  postFeedback,
  postCareer,
} from "../controllers/user.js";
import { getUserInfo } from "../controllers/admin.js";
const Router = router();

Router.get("/", (req, res) => {
  console.log(req.session.user, req.session.role);
  res.render("main.ejs", {
    isLoggedIn: req.session.user,
    role: req.session.role,
  }),
    (err, html) => {
      console.error(err);
      res.render("error.ejs", {
        message: "Something went wrong in render",
      });
    };
});

Router.get("/login", (req, res) => {
  res.render("login.ejs", {
    isLoggedIn: req.session.user,
    role: req.session.role,
  }),
    (err, html) => {
      console.error(err);
      res.render("error.ejs", {
        message: "Something went wrong in render",
      });
    };
});
Router.post("/login", postLogin);

Router.get("/register", (req, res) => {
  res.render("register.ejs", {
    isLoggedIn: req.session.user,
    role: req.session.role,
  }),
    (err, html) => {
      console.error(err);
      res.render("error.ejs", {
        message: "Something went wrong in render",
      });
    };
});
Router.post("/register", postRegister);

Router.get("/services", (req, res) => {
  res.render("services.ejs", {
    isLoggedIn: req.session.user,
    role: req.session.role,
  }),
    (err, html) => {
      console.error(err);
      res.render("error.ejs", {
        message: "Something went wrong in render",
      });
    };
});

Router.get("/e-commerce", (req, res) => {
  res.render("e-commerce.ejs", {
    isLoggedIn: req.session.user,
    role: req.session.role,
  }),
    (err, html) => {
      console.error(err);
      res.render("error.ejs", {
        message: "Something went wrong in render",
      });
    };
});

Router.get("/websites", (req, res) => {
  res.render("websites.ejs", {
    isLoggedIn: req.session.user,
    role: req.session.role,
  }),
    (err, html) => {
      console.error(err);
      res.render("error.ejs", {
        message: "Something went wrong in render",
      });
    };
});

Router.get("/mobiles", (req, res) => {
  res.append("x-ctf-flag", "ctf{th4t_w4s_3asy}");
  res.render("mobiles.ejs", {
    isLoggedIn: req.session.user,
    role: req.session.role,
  }),
    (err, html) => {
      console.error(err);
      res.render("error.ejs", {
        message: "Something went wrong in render",
      });
    };
});

Router.get("/feedback", getFeedback);
Router.post("/feedback", postFeedback);

Router.get("/career", (req, res) => {
  res.render("career.ejs", {
    isLoggedIn: req.session.user,
    role: req.session.role,
  }),
    (err, html) => {
      console.error(err);
      res.render("error.ejs", {
        message: "Something went wrong in render",
      });
    };
});
Router.post("/career", postCareer);

Router.get("/contact", (req, res) => {
  res.render("contact.ejs", {
    isLoggedIn: req.session.user,
    role: req.session.role,
  }),
    (err, html) => {
      console.error(err);
      res.render("error.ejs", {
        message: "Something went wrong in render",
      });
    };
});
Router.post(
  "/contact",
  raw({ type: ["application/json", "application/xml", "text/xml"] }),
  postContact
);

Router.get("/about-us", (req, res) => {
  res.render("about-us.ejs", {
    isLoggedIn: req.session.user,
    role: req.session.role,
  }),
    (err, html) => {
      console.error(err);
      res.render("error.ejs", {
        message: "Something went wrong in render",
      });
    };
});

Router.get("/admin", verifyActiveSession, isAdmin);
Router.get("/users", getUserInfo);

Router.get("/robots.txt", (req, res) => {
  res.write("ctf{lik3_mr_r0b0t}");
  res.end();
});

Router.get("/logout", verifyActiveSession, logout, (req, res) => {
  res.render("main.ejs", {
    isLoggedIn: req.session.user,
    role: req.session.role,
  }),
    (err, html) => {
      console.error(err);
      res.render("error.ejs", {
        message: "Something went wrong in render",
      });
    };
});

Router.get("/test", (req, res) => {
  res.write(`{
    "name": "ctf",
    "version": "1.0.0",
    "description": "",
    "main": "app.js",
    "type": "module",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "start": "nodemon -L app.js"
    }`);
  res.end();
});
export default Router;
