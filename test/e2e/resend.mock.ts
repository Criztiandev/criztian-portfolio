import { createServer } from "node:http"

const port = Number(process.argv[2])
const emails: unknown[] = []

createServer((request, response) => {
  response.setHeader("content-type", "application/json")
  if (request.method === "GET") {
    response.end(JSON.stringify(emails))
    return
  }
  let body = ""
  request.setEncoding("utf8")
  request.on("data", (chunk) => {
    body += chunk
  })
  request.on("end", () => {
    try {
      emails.push(JSON.parse(body))
    } catch {
      response.statusCode = 400
      response.end(JSON.stringify({ message: "Invalid JSON" }))
      return
    }
    response.end(JSON.stringify({ id: `e2e-${emails.length}` }))
  })
}).listen(port, "127.0.0.1")
