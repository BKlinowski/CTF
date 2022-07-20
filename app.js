import express from "express";
import dotenv from "dotenv";
import ejs from "ejs"
import session from "express-session";
import pgSession from "connect-pg-simple"
import { db } from "./db.js"
import { pool } from "./db.js";

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
        }
    })()

dotenv.config();
app.use(express.urlencoded({ extentended: false }))
app.use(express.json());
app.use(express.static('public'))
app.use(session({
    store: new pg_store({
        pool: pool,
        createTableIfMissing: true
    }), secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false
}))

import routes from "./routes/routes.js"
app.use(routes)

app.listen(process.env.PORT || 80, function () {
    console.log(`Server listening for connection requests on socket localhost: ${process.env.PORT || 3000}`);
});
//