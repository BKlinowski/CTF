import { db } from "../db.js"
import bcrypt from "bcrypt"

export const postLogin = (req, res) => {
    console.log(req.body)
    req.session.isLoggedIn = true
    req.session.user = req.body.user
    req.session.save()
    res.redirect("/")
}

export const postRegister = async (req, res) => {
    console.log(req.body)
    const { forename, surname, email, password } = req.body

    const hashedPass = await bcrypt.hash(password, 14);
    await db.query(`INSERT INTO users VALUES (${forename}, ${surname}, ${email}, '123')`)
    res.redirect("/register")
}