import { db, pool } from "../db.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

export const postLogin = async (req, res) => {
    const { email, password } = req.body
    const [userExists] = await db.queryRows(`select exists(
        SELECT FROM users WHERE email = '${email}'
        );`)
    if (userExists.exists) {
        const [user] = await db.queryRows(`SELECT * FROM users WHERE email = '${email}' LIMIT 1`)
        console.log(user)
        const userPass = await bcrypt.compare(password, user.password)
        // console.log(userPass)
        console.log(req.session.user)
        if (userPass && !req.session.user) {
            req.session.user = user.email
            req.session.role = "user"
            req.session.session_id = uuidv4();
            const token = jwt.sign(JSON.stringify({ role: "user", session_id: req.session.session_id }), process.env.TOKEN_KEY)
            req.session.save()
            console.log("SESSION", req.session)
            res.cookie("token", token).redirect("/login")
        } else {
            res.redirect("/")
        }
    } else {
        res.redirect("/login")
    }
}

export const postRegister = async (req, res) => {
    const { forename, surname, email, password } = req.body
    const hashedPass = await bcrypt.hash(password, 14);
    try {
        await db.query(`INSERT INTO users VALUES (default, '${forename}', '${surname}', '${email}', '${hashedPass}')`)
    } catch (error) {
        console.error(error)
    }
    res.redirect("/login")
}

export const verifyActiveSession = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    } else {
        const body = token.split(".")[1];
        let buff = new Buffer(body, "base64url")
        let text = buff.toString('ascii');
        let re = /("role":("[a-z]*"))/
        const role = text.match(re)[2].slice(1, -1)
        re = /("session_id":("[a-z0-9-]*"))/
        const session_id = text.match(re)[2].slice(1, -1)
        console.log(typeof session_id)
        const query = `SELECT sess FROM session WHERE sess like '%$1%'`
        const value = [session_id]
        const active_sessions = await pool.query(query, value)
        console.log(typeof active_sessions.rows[0])
        return next()
    }
}

export const isAdmin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY, { complete: true });
        const body = token.split(".")[1];
        let buff = Buffer.from(body, "base64url")
        let text = buff.toString('ascii');
        console.log(text)
        console.log("DECODED: ", decoded)
        console.log(req.session.session_id)
        if (decoded.session_id != req.session.session_id) {
            return res.status(403).send("This session isn't active")
        } else {
            console.log(decoded.role)
            return res.send("Valid token")
        }

    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
}