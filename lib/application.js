/** 路由表 */

var Router = require('./router');
const http = require('http')

const host = '127.0.0.1'


function createApplication() {
    return {
        _router: new Router(),
        get: function (path, handler) {
            this._router.get(path, handler)
        },
        listen: function (port, cb) {
            var self = this;

            var server = http.createServer(function (req, res) {
                if (!res.send) {
                    res.send = function (body) {
                        res.writeHead(200, {
                            'Content-Type': 'text/plain'
                        });
                        res.end(body);
                    };
                }

                return self._router.handle(req, res);
            });

            return server.listen.apply(server, arguments);
        }
    }
}

exports = module.exports = createApplication