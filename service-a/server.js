const http = require("http");

http.createServer((req, res) => {
	res.end("Service A is handling this request");
}).listen(3000, () => console.log("Service A running on port 3000"));
