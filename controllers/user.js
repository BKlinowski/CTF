import * as xmlparser from "fast-xml-parser";
import { SocksProxyAgent } from "socks-proxy-agent";
import axios from "axios";
import { parse } from "url";

export const postContact = (req, res) => {
  const contentType = req.get("Content-Type");
  console.log(contentType);
  if (contentType.includes("application/json")) {
    console.log(req.body);
    res.render("contactResponse.ejs", {
      response: "JSON data has been submitted",
    });
  } else if (
    contentType.includes("application/xml") ||
    contentType.includes("text/xml")
  ) {
    let proxy = "socks://php:1234";
    console.log("using proxy server %j", proxy);
    var endpoint = "http://php/xxe.php";
    console.log("attempting to GET %j", endpoint);
    var opts = parse(endpoint);
    var agent = new SocksProxyAgent(proxy);
    opts.agent = agent;
    const xmldata = Buffer.from(req.body).toString("utf8");
    axios({
      method: "post",
      httpAgent: agent,
      url: "http://php/xxe.php",
      data: {
        xmldata,
      },
    })
      .then((response) => {
        console.log(response.data);
        res.render("contactResponse.ejs", { response: response.data });
      })
      .catch((err) => {
        console.log("Err: ", err);
      });
  }
};
