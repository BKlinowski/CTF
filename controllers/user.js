import { SocksProxyAgent } from "socks-proxy-agent";
import axios from "axios";
import http from "http";
import { parse } from "url";
import { db } from "../db.js";

export const postContact = (req, res) => {
  const contentType = req.get("Content-Type");
  if (contentType.includes("application/json")) {
    res.render("contactResponse.ejs", {
      isLoggedIn: req.session.user,
      role: req.session.role,
    });
  } else if (
    contentType.includes("application/xml") ||
    contentType.includes("text/xml")
  ) {
    let proxy = "socks://php:1234";
    var endpoint = "http://php/xxe.php";
    var opts = parse(endpoint);
    var agent = new SocksProxyAgent(proxy);
    opts.agent = agent;
    const xmldata = Buffer.from(req.body).toString("utf8");

    axios("http://php/xxe.php", {
      method: "post",
      httpAgent: agent,
      data: {
        xmldata,
      },
    }).catch((err) => {
      console.log("Err: ", err);
    });
    http.get(opts, function (res) {
      console.log(process.stdout);
      res.pipe(process.stdout);
    });
  }
};

export const postFeedback = async (req, res) => {
  const filter = ["script", "image", "style", "body", "alert", "console"];
  const { name, comment } = req.body;
  console.log(filter.length);
  for (let i = 0; i < filter.length; i++) {
    const commentLowerCase = comment.toLowerCase();
    if (commentLowerCase.includes(filter[i]) == true) {
      res.redirect("/");
      break;
    }
    if (i == filter.length - 1) {
      try {
        await db.query("INSERT INTO comments VALUES (default, $1, $2)", [
          name,
          comment,
        ]);
      } catch (error) {
        console.error(error);
      }
      res.redirect("/feedback");
    }
  }
};

export const getFeedback = async (req, res) => {
  const comments = await db.queryRows(
    `SELECT comment,name FROM comments ORDER BY id DESC LIMIT 3`
  );
  res.render("feedback.ejs", {
    comment1: comments[0].comment,
    name1: comments[0].name,
    comment2: comments[1].comment,
    name2: comments[1].name,
    comment3: comments[2].comment,
    name3: comments[2].name,
    isLoggedIn: req.session.user,
    role: req.session.role,
  });
};

export const postCareer = async (req, res) => {
  console.log(req.files.myFile.mimetype);
  if (!req.files) {
    res.render("careerResponse.ejs", { response: "Nie dodano pliku!" });
  } else if (req.files.myFile.mimetype == "application/pdf") {
    const file = req.files.myFile;
    const magicBytes = file.data.slice(0, 5);
    const expectedMagicBytes = Buffer.from("255044462D", "hex");
    if (magicBytes == expectedMagicBytes.toString()) {
      res.render("careerResponse.ejs", {
        response: "Dziekujemy za zgloszenie!",
        isLoggedIn: req.session.user,
        role: req.session.role,
      });
    } else {
      res.render("careerResponse.ejs", {
        response: "CTF{Nic3_try_m4gic_byt3s}",
        isLoggedIn: req.session.user,
        role: req.session.role,
      });
    }
  } else {
    res.render("careerResponse.ejs", { response: "Niepoprawny format pliku!" });
  }
};

export const postTest = (req, res, next) => {
  res.write(`{
    "name": "ctf",
    "version": "1.0.0",
    "description": "",
    "main": "app.js",
    "type": "module",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "start": "nodemon -L app.js"
    }`);
  req.end();
};
