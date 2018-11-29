// var http = require('http')
// http.createServer((req, res) => {
//     res.writeHead(200)
//     res.end('hello world')
// }).listen(Math.round((1 + Math.random()) * 1000), '127.0.0.1')

process.on('message', (m, server) => {
    if (m === 'server') {
        server.on('connection', (socket) => {
            socket.end(`handled by child, pid is ${process.pid}\n`)
        })
    }
})