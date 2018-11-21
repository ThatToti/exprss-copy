var Router = function () {
    this.stack = [new Layer('*', (req, res) => {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('404');
    })];
};


Router.prototype.get = function (path, fn) {
    this.stack.push(new Layer(path, fn));
};


Router.prototype.handle = function (req, res) {
    for (var i = 1, len = this.stack.length; i < len; i++) {
        if ((req.url === this.stack[i].path || this.stack[i].path === '*') &&
            (req.method === this.stack[i].method || this.stack[i].method === '*')) {
            return this.stack[i].handle && this.stack[i].handle(req, res);
        }
    }

    this.stack.map(layer => {
        if (layer.match(req.url)) {
            return layer.handle_request(req, res)
        }
    })

    return this.stack[0].handle_request(req, res)
};


function Layer(path, fn) {
    this.path = path
    this.handle = fn
    this.name = fn.name || '<anonymous>'
}

Layer.prototype.handle_request = function (req, res) {
    var fn = this.handle

    fn && fn(req, res)
}

Layer.prototype.match = function (path) {
    if (path === this.path || path === '*') {
        return true
    }

    return false
}

exports = module.exports = Router