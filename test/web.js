
var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')
var querystring = require('querystring')


/** control 模块 */
var handles = {
    index: {
        index: function (req, res) {
            var pathname = url.parse(req.url).pathname;
            /** 读取静态文件 */
            fs.readFile(path.resolve(__dirname, `../doc/${pathname}.html`), (err, file) => {
                if (err) {
                    res.writeHead(404, {
                        'Content-Type': 'text/plain'
                    })
                    res.end('找不到文件')
                    return
                }

                res.writeHead(200, {
                    'Content-Type': 'text/plain',
                })
                res.end(file)
            })
        }
    }
}

var server = http.createServer((req, res) => {


    console.log(`请求的方法是:${req.method}`)

    var pathname = url.parse(req.url).pathname;

    var paths = pathname.split('/')

    console.log(`请求的路径是:${pathname}`)

    var controller = paths[1] || 'index'

    var action = paths[2] || 'index'

    var args = paths.slice(3)

    /** true 传入querystring 的 parse 方法,解析成对象;否则,是没解析和解码的字符串 */
    var query = url.parse(req.url, true).query
    console.log('查询字符串:', query)

    /** 路由控制器 */
    if (handles[controller] && handles[controller][action]) {
        handles[controller][action].apply(null, [req, res].concat(args))
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('port', 8000)
})