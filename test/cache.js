var http = require('http')
var fs = require('fs')
var path = require('path')
var crypto = require('crypto')

var getHash = function (str) {
    var shasum = crypto.createHash('sha1')
    return shasum.update(str).digest('base64')
}

var server = http.createServer((req, res) => {

    var filename = path.resolve(__dirname, '../doc/index.html')

    /** 时间戳 */
    // fs.stat(filename, (err, stat) => {

    //     var lastModified = stat.mtime.toUTCString()

    //     if (lastModified == req.headers['if-modified-since']) {
    //         res.writeHead(304)
    //         res.end()
    //     } else {
    //         fs.readFile(filename, (err, file) => {
    //             var lastModified = stat.mtime.toUTCString()
    //             res.setHeader('Last-Modified', lastModified)
    //             res.writeHead(200)
    //             res.end(file)
    //         })
    //     }
    // })

    /** etag */
    // fs.readFile(filename, (err, file) => {
    //     var hash = getHash(file)
    //     var noneMatch = req.headers['if-none-match']

    //     if (hash === noneMatch) {
    //         res.writeHead(304, 'Not Modified')
    //         res.end()
    //     } else {
    //         res.setHeader("ETag", hash)
    //         res.writeHead(200)
    //         res.end(file)
    //     }
    // })

    /** cache-control */
    fs.readFile(filename, (err, file) => {
        res.setHeader('Cache-Control', `max-age=${10 * 365 * 1000};public`)
        res.writeHead(200)
        res.end(file)
    })



})

server.listen(8000, '127.0.0.1')