import bcrypt from "bcryptjs";
import { db, pool } from "../db.js";
import ejs from "ejs";

export const postAddUser = async (req, res, next) => {
  const { forename, surname, email, password } = req.body;
  const hashedPass = await bcrypt.hash(password, 14);
  try {
    await db.query(
      `INSERT INTO users VALUES (default, '${forename}', '${surname}', '${email}', '${hashedPass}')`
    );
  } catch (error) {
    console.error(error);
  }
  res.redirect("/login");
};

export const getUsers = async (req, res) => {
  // console.log(process.mainModule);
  // const query = `SELECT email FROM users`;
  // const users = await pool.query(query);
  // console.log(users.rows);
  res.render("users.ejs", req.query);
};
