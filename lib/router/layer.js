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

exports = module.exports = Layer