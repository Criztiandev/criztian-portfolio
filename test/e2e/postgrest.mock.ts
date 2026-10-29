import { createServer } from "node:http"

const port = Number(process.argv[2])

createServer((request, response) => {
  request.resume()
  response.setHeader("content-type", "application/json")
  response.end("[]")
}).listen(port, "127.0.0.1")
