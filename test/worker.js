var http = require('http')

var server = http.createServer((req, res) => {
    res.writeHead(200)
    res.end(`handled by child, pid is ${process.pid}\n`)
})

var worker

process.on('message', (msg, tcp) => {

    worker = tcp

    if (msg === 'server') {
        tcp.on('connection', (socket) => {
            socket.end(`handled by worker ${process.pid}`)
            throw new Error('throw err')
        })
    }
})

process.on(`uncaughtException`, (err) => {
    process.send({ act: 'suicide' })

    worker.close(() => process.exit(1))
})