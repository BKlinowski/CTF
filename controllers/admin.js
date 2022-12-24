export const getUserInfo = async (req, res) => {
  const email = req.query.email;
  console.log("email", email);

  const [userExists] = await db.queryRows(`select exists(
    SELECT FROM users WHERE email = '${email}'
    );`);

  if (userExists.exists) {
    const [user] = await db.queryRows(
      `SELECT * FROM users WHERE email = '${email}' LIMIT 1`
    );

    console.log(user);
    res.render(
      "users.ejs",
      {
        response: user,
        query: req.query,
        isLoggedIn: req.session.user,
        isAdmin: req.session.role,
      },
      undefined,
      (err, html) => {
        if (err) throw new Error("Something went wrong in render");
        var processed = process(html);
        res.send(processed);
      }
    );
  } else {
    res.redirect("/");
  }
};

// export const getAdminPage = async (req, res) => {
//   res.render("admin.ejs")
// }
