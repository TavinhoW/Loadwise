const http = require("http");

http.createServer((req, res) => {
	res.end("Service B is handling this request");
}).listen(3000, () => console.log("Service B running on port 3000"));
