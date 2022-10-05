import * as xmlparser from "fast-xml-parser"
import * as xmlengine from "libxmljs"
import axios from "axios"

export const postContact = (req, res) => {
    let { XMLBuilder, XMLParser, XMLValidator } = xmlparser
    let { parseXml } = xmlengine
    const contentType = req.get("Content-Type")
    console.log(contentType)
    if (contentType.includes("application/json")) {
        console.log(req.body);
        res.render("contactResponse.ejs", { response: "JSON data has been submitted" })
    } else if (contentType.includes("application/xml") || contentType.includes("text/xml")) {
        const xmldata = Buffer.from(req.body).toString("utf8")
        axios({
            method: 'post',
            url: 'http://php/xxe.php',
            data: {
                xmldata
            }
        })
            .then(response => {
                console.log(response.data)
                res.render("contactResponse.ejs", { response: response.data })
            })
            .catch(err => {
                console.log("Err: ", err)
            })

    }

}