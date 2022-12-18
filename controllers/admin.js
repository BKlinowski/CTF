export const getUserInfo = async (req, res) => {
  const email = req.query.email;
  console.log("email", email)

  const [userExists] = await db.queryRows(`select exists(
    SELECT FROM users WHERE email = '${email}'
    );`);

  if (userExists.exists) {
    const [user] = await db.queryRows(
      `SELECT * FROM users WHERE email = '${email}' LIMIT 1`
    );

    console.log(user);
    res.render("user.ejs", { response: user, query: req.query });
  }
  else {
    res.redirect('/')
  }
};

export const getAdminPage = async (req, res) => {
  res.render("admin.ejs")
}