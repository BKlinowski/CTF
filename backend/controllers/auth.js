import { db, pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("email: ", email)
  console.log("abc")
  const [userExists] = await db.queryRows(
    "select exists(SELECT FROM users WHERE email = $1);",
    [email]
  );
  if (userExists.exists) {
    const [user] = await db.queryRows(
      "SELECT * FROM users WHERE email = $1;",
      [email]
    );
    const userPass = await bcrypt.compare(password, user.password);
    console.log(req.session.user);
    if (userPass && !req.session.user && !req.session.role) {
      req.session.user = user.email;
      req.session.role = "user";
      req.session.session_id = uuidv4();
      const token = jwt.sign(
        JSON.stringify({ role: "user", session_id: req.session.session_id }),
        process.env.TOKEN_KEY
      );

      console.log(token);
      req.session.save();
      console.log("SESSION", req.session);
      res.cookie("token", token);
      res.redirect("/user");
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
};

export const postRegister = async (req, res) => {
  const { forename, surname, email, password } = req.body;
  const hashedPass = await bcrypt.hash(password, 14);
  try {
    const query = "INSERT INTO users VALUES (default, $1, $2, $3, $4)";
    const params = [forename, surname, email, hashedPass];

    await pool.query(query, params);
  } catch (error) {
    console.error(error);
  }
  res.redirect("/login");
};

export const verifyActiveSession = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).render(
      "not-admin.ejs",
      {
        text: "Token jest wymagany do autoryzacji",
        isLoggedIn: req.session.user,
        role: req.session.role,
      },
      (err, html) => {
        console.error(err);
        res.render("error.ejs", {
          message: "Something went wrong in render",
        });
      }
    );
  } else {
    const body = token.split(".")[1];
    let buff = Buffer.from(body, "base64url");
    let text = buff.toString("ascii");
    let re = /("role":\s*("[a-z]*"))/;
    const role = text.match(re)[2].slice(1, -1);
    re = /("session_id":\s*("[a-z0-9-]*"))/;
    const session_id = text.match(re)[2].slice(1, -1);
    console.log(session_id, role);
    const query = `SELECT COUNT(*)::int as ACTIVE_SESSION FROM session WHERE sess->>'session_id'=$1 AND sess->>'role'=$2`;
    const value = [session_id, role];
    const active_sessions = await pool.query(query, value);
    console.log(active_sessions.rows);
    if (active_sessions.rows[0].active_session == 1) {
      return next();
    } else {
      return res.status(403).render(
        "not-admin.ejs",
        {
          text: "Twoja sesja nie jest aktywna",
          isLoggedIn: req.session.user,
          role: req.session.role,
        },
        (err, html) => {
          console.error(err);
          res.render("error.ejs", {
            message: "Something went wrong in render",
          });
        }
      );
    }
  }
};

export const logout = async (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

export const isAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).render(
      "not-admin.ejs",
      {
        text: "Token jest wymagany do autoryzacji",
        isLoggedIn: req.session.user,
        role: req.session.role,
      },
      (err, html) => {
        console.error(err);
        res.render("error.ejs", {
          message: "Something went wrong in render",
        });
      }
    );
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY, {
      complete: true,
    });
    if (decoded.payload.role != "admin") {
      return res.status(403).render(
        "not-admin.ejs",
        {
          text: "Twoją rolą nie jest admin, nie masz uprawnień do wyświetlenia tej strony",
          isLoggedIn: req.session.user,
          role: req.session.role,
        },
        (err, html) => {
          if (err) throw new Error("Something went wrong in render");

          res.send(html);
        }
      );
    } else {
      if (req.path === "admin") {
        return res.render(
          "admin.ejs",
          { isLoggedIn: req.session.user, role: "admin" },
          (err, html) => {
            if (err) throw new Error("Something went wrong in render");
            res.send(html);
          }
        );
      } else if (req.path === "users") {
        return res.render(
          "users.ejs",
          { isLoggedIn: req.session.user, role: "admin" },
          (err, html) => {
            console.error(err);
            res.render("error.ejs", {
              message: "Something went wrong in render",
            });
          }
        );
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(403).render(
      "not-admin.ejs",
      {
        text: "Błędny token",
        isLoggedIn: req.session.user,
        role: req.session.role,
      },
      (err, html) => {
        console.error(err);
        res.render("error.ejs", {
          message: "Something went wrong in render",
        });
      }
    );
  }
};
