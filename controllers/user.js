import * as xmlparser from "fast-xml-parser"
import * as xmlengine from "libxmljs"

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
        console.log(xmldata)
        try {
            let test = parseXml(xmldata, { noent: true, nonet: false })
            console.log(test.toString())
        } catch (err) {
            console.log(err)
        }


        res.render("contactResponse.ejs", { response: "JSON data has been submitted" })
    }

}