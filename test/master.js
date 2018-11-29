var cp = require('child_process')
var cpus = require('os').cpus()
var net = require('net')

// for (let i = 0; i < cpus.length; i++) {
//     fork('./worker.js')
// }
var child1 = cp.fork('./worker.js')
var child2 = cp.fork('./worker.js')

var server = net.createServer()

server.on('connection', (socket) => {
    socket.end('handled by parent\n')
})

server.listen(1337, () => {
    child1.send('server', server)
    child2.send('server', server)
})

