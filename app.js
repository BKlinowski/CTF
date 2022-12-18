import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import pgSession from "connect-pg-simple";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { readFileSync } from 'node:fs';

import { db } from "./db.js";
import { pool } from "./db.js";
import routes from "./routes/routes.js";

const pg_store = pgSession(session);
const app = express();

const setHeaders = (res, path) => {
  if (path === "/app/public/js/contactUs.js") {
    res.setHeader("Content-Type", "application/javascript");
  }
}


const init = async () => {
  const { rows } = await db.query(`select exists(
    SELECT FROM pg_tables WHERE tablename = 'users'
    );`);
  if (!rows[0].exists) {
    const sqlquery = readFileSync("./sql/query.sql")
    await db.query(sqlquery)
    const stephPass = await bcrypt.hash("a123456789", 8);
    const thiefPass = await bcrypt.hash(
      "$GgK2MN##2zy^8mdKP$iPF$Y^CBm2!h#Yf*R*7fdSf@XqXt2UgW8P2XN!Wy4GCW#",
      10
    );
    await db.query(
      `INSERT INTO users VALUES (default, 'Stephen', 'Nilesh', 'stephen@codeberry.pl', '${stephPass}'), 
      (default, 'John', 'Thief', 'thief@codeberry.pl', '${thiefPass}')`
    );
  }
}
init()

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  express.static("public", {
    setHeaders,
  })
);
app.use(
  session({
    store: new pg_store({
      pool: pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: false },
  })
);
app.use(fileUpload({
  limits: {
    fileSize: 1024 * 1024
  },
  abortOnLimit: true,
  responseOnLimit: true
}));
app.use((req, res, next) => {
  if (req.session.user == "stephen@codeberry.pl") {
    res.write("ctf{brut3_f0rc3}");
    res.end();
  } else {
    return next();
  }
});

dotenv.config();













app.use(routes);



app.listen(process.env.PORT || 80, function () {
  console.log(
    `Server listening for connection requests on socket localhost: ${process.env.PORT || 80
    }`
  );
});