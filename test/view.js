var http = require('http')
var fs = require('fs')
var path = require('path')



var server = http.createServer((req, res) => {

    let filepath = path.resolve(__dirname, '../doc/index.css')

    /** download file */
    res.sendFile = (filepath) => {
        fs.stat(filepath, (err, stat) => {

            if (err) res.end(err)

            var stream = fs.createReadStream(filepath)

            res.writeHead(200, {
                'Content-Type': 'text/css',
                'Content-Length': stat.size,
                'Content-Disposition': `attachment;filename='hello.css'`
            })

            stream.pipe(res)
        })
    }

    /** respnese json */
    res.json = (json) => {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(json))
    }

    /** 302 redirect */
    res.redirect = (url) => {
        res.writeHead(302, {
            'Location': url
        })
        res.end('redirect to new address')
    }

    /** render html */
    res.render = (view, data) => {

    }

    res.writeHead(200)
    res.end(`<html><body>hello world</body></html>`)
})

server.listen(8000)