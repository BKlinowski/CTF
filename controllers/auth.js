import { db, pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const [userExists] = await db.queryRows(`select exists(
        SELECT FROM users WHERE email = '${email}'
        );`);
  if (userExists.exists) {
    const [user] = await db.queryRows(
      `SELECT * FROM users WHERE email = '${email}' LIMIT 1`
    );
    console.log(user);
    const userPass = await bcrypt.compare(password, user.password);
    // console.log(userPass)
    console.log(req.session.user);
    if (userPass && !req.session.user) {
      req.session.user = user.email;
      req.session.role = "amin";
      req.session.session_id = uuidv4();
      const token = jwt.sign(
        JSON.stringify({ role: "admin", session_id: req.session.session_id }),
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
    await db.query(
      `INSERT INTO users VALUES (default, '${forename}', '${surname}', '${email}', '${hashedPass}')`
    );
  } catch (error) {
    console.error(error);
  }
  res.redirect("/login");
};

export const verifyActiveSession = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  } else {
    const body = token.split(".")[1];
    let buff = Buffer.from(body, "base64url");
    let text = buff.toString("ascii");
    console.log(text);
    let re = /("role":\s*("[a-z]*"))/;
    const role = text.match(re)[2].slice(1, -1);
    console.log(role);
    re = /("session_id":\s*("[a-z0-9-]*"))/;
    const session_id = text.match(re)[2].slice(1, -1);
    const query = `SELECT COUNT(*)::int as ACTIVE_SESSION FROM session WHERE sess->>'session_id'=$1 AND sess->>'role'=$2`;
    const value = [session_id, role];
    const active_sessions = await pool.query(query, value);
    console.log(active_sessions.rows);
    
    if (active_sessions.rows[0].active_session == 1) {
      return next();
    } else {
      res.write("Your session isn't active :<");
      res.end();
    }
  }
};



export const logout = async (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/') 
  })
};

export const getuser = async (req, res, next) => {
 
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
    res.render("user.ejs", { response: user});
  }
  else{
    res.redirect('/')
  }

};

export const isAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY, {
      complete: true,
    });
    const body = token.split(".")[1];
    let buff = Buffer.from(body, "base64url");
    let text = buff.toString("ascii");
    console.log(text);
    console.log("DECODED: ", decoded);
    console.log(decoded.payload.role);
    if (decoded.payload.role != "admin") {
      return res.status(403).send("You are not an admin :<");
    } else {
      console.log(decoded.role);
      return res.send("Congratulations! You are an admin!");
    }
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
  }
  return next();
};
