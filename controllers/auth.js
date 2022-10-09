import { db } from "../db.js"
import bcrypt from "bcryptjs"

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
            req.session.save()
            console.log("SESSION", req.session)
            res.redirect("/login")
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