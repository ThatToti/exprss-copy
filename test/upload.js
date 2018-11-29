
var http = require('http')
var fs = require('fs')
var crypto = require('crypto')

var generateRandom = function (len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')
        .slice(0, len)
}

var server = http.createServer((req, res) => {

    debugger

    var token = generateRandom(24)
    res.writeHead(200)
    res.end(`<input type="hidden" name='_csrf' value="${token}" />`)
})

server.listen(8000)