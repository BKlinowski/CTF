import express from "express";
import dotenv from "dotenv";
import ejs from "ejs"
import session from "express-session";
import pgSession from "connect-pg-simple"
import { db } from "./db.js"
import { pool } from "./db.js";
import bcrypt from "bcrypt"

const pg_store = pgSession(session)
const app = express()

    ; (async () => {
        const { rows } = await db.query(`select exists(
    SELECT FROM pg_tables WHERE tablename = 'users'
    );`)
        console.log()
        if (rows[0].exists) {
            await db.query("SELECT * FROM users")
        } else {
            await db.query(`CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            forename VARCHAR(255) NOT NULL,
            surname VARCHAR(255) NOT NULL,
            email VARCHAR (255) NOT NULL,
            password TEXT NOT NULL
        );`)
            const stephPass = await bcrypt.hash("a123456789", 8);
            await db.query(`INSERT INTO users VALUES (default, 'Stephen', 'Nilesh', 'stephen@codeberry.pl', '${stephPass}')`)
        }
    })()

dotenv.config();

app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.use(express.static('public', {
    setHeaders
}))

function setHeaders(res, path) {
    if (path === "/app/public/js/contactUs.js") {
        res.setHeader('Content-Type', "application/javascript")
    }
}

app.use(session({
    store: new pg_store({
        pool: pool,
        createTableIfMissing: true
    }), secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false
}))

app.use((req, res, next) => {
    console.log(req.session.user)
    if (req.session.user == "stephen@codeberry.pl") {
        res.write("ctf{brut3_f0rc3}")
        res.end()
    } else {
        return next()
    }
})

import routes from "./routes/routes.js"
app.use(routes)

app.listen(process.env.PORT || 80, function () {
    console.log(`Server listening for connection requests on socket localhost: ${process.env.PORT || 3000}`);
});
//