import express from "express";
import dotenv from "dotenv";
import ejs from "ejs"

const app = express()

dotenv.config();
app.use(express.json());
app.use(express.static('public'))

import routes from "./routes/routes.js"
app.use(routes)

app.listen(process.env.PORT || 3000, function () {
    console.log(`Server listening for connection requests on socket localhost: ${process.env.PORT || 3000}`);
});