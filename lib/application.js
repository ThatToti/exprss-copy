/** 路由表 */
const http = require('http')

const host = '127.0.0.1'


var routers = [{
    path: '*',
    method: '*',
    handler: function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        res.end('404')
    }
}]

function createApplication() {
    return {
        get: function (path, handler) {
            routers.push({
                path: path,
                method: 'get',
                handle: handler
            })
        },
        listen: function (port, cb) {
            const server = http.createServer((req, res) => {

                routers.map(router => {
                    if ((req.url === router.path || router.path === '*') && (req.method === router.method || router.method === '*')) {
                        router.handler && router.handler(req, res)
                    }
                })

            })

            return server.listen.apply(server, arguments);
        }
    }
}

exports = module.exports = createApplication