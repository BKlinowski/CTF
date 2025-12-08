import { db } from "../db.js";

export const getUserInfo = async (req, res) => {
  const email = req.query.email;

  const [userExists] = await db.queryRows(
    "select exists(SELECT FROM users WHERE email = $1);",
    [email]
  );

  if (userExists.exists) {
    const [user] = await db.queryRows(
      "select exists(SELECT FROM users WHERE email = $1);",
      [email]
    );
    req.query.user = user;
    req.query.role = "admin";
    req.query.isLoggedIn = true;
    res.render("users.ejs", req.query),
      (err, html) => {
        console.error(err);
        res.render("error.ejs", {
          message: "Something went wrong in render",
        });
      };
  }
};

// export const getAdminPage = async (req, res) => {
//   res.render("admin.ejs")
// }
