const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify")

const replaceTemplate = require("./modules/replaceTemplate")

// const textIn = readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn)

// writeFileSync("./txt/output.txt", textIn)
const tempOverview = fs.readFileSync("./templates/template-overview.html", "utf-8")
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8")
const tempProduct = fs.readFileSync("./templates/template-product.html", "utf-8")

const data = fs.readFileSync("./dev-data/data.json", "utf-8")
const productData = JSON.parse(data);

const slugs = productData.map(element => slugify(`${element.productName}`, {lower:true}))
console.log(slugs)

const server = http.createServer((req, res) => {
    const {query, pathname} =url.parse(req.url, true)

    if(pathname=="/overview" || pathname=="/"){
        res.writeHead(200, {"Content-type" : "text/html"})

        const cardHtml = productData.map(element => replaceTemplate(tempCard, element)).join("")
        const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml)
        res.end(output)
    }
    else if(pathname=="/product"){
        const product = productData[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
    }
    else if (pathname == "/api"){
        res.writeHead(200, {"Content-type" : "application/json"})
        resend(data)
    }
    else{
        res.writeHead(404, {
            "Content-type": "text/html",
            "my-own-header": "Hello-world"
        })
        res.end("<h1>Page Not Found</h1>")
    }
})

server.listen(3000, () => {
    console.log("server is listening...")
})