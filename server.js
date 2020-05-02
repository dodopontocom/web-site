const http = require('http');

const server = http.createServer((req, res) => {
    res.end('This is a response');
});

//server.listen(process.env.PORT || 3000);
var port = process.env.PORT
console.log(port);
