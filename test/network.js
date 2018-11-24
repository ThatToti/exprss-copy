var net = require('net')

var server = net.createServer(socket => {
    socket.on('data', data => {
        socket.write('hello')
    })

    socket.on('end', () => {
        console.log('end')
    })

    socket.write('hello toti')
})

server.listen(8124, () => {
    console.log('server bound')
})