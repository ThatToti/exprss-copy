
const http = require('http')

const host = '127.0.01'
const port = 3000

const server = http.createServer((req, res) => {
    console.log('starting server')
})

server.listen(port, host, () => {
    console.log('listening...')
})


function createApplication() {
    return {
        get: function () {
            console.log('get')
        },
        listen: function (port, cb) {
            console.log('listen')
        }
    }
}

exports = module.exports = createApplication;