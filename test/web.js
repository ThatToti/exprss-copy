
var http = require('http')
var url = require('url')
const { URLSearchParams } = require('url')
var fs = require('fs')
var path = require('path')
var querystring = require('querystring')
var crypto = require('crypto')

/** cookie 构造器 */
var serialize = (name, val, opt = {}) => {
    var pairs = [`${name}=${val}`]

    if (opt.maxAge) pairs.push(`Max-Age=${opt.maxAge}`)
    if (opt.domain) pairs.push(`Domain=${opt.domain}`)
    if (opt.path) pairs.push(`Path=${opt.path}`)
    if (opt.expires) pairs.push(`Expires=${opt.expires.toUTCString()}`)
    if (opt.httpOnly) pairs.push(`HttpOnly`)
    if (opt.secure) pairs.push(`Secure`)

    return pairs.join(';')
}

/** 解析 cookie 模块 */
var parseCookie = function (cookie) {
    var cookies = {}

    if (!cookie) {
        return cookies
    }

    cookie.split(';').map(item => {
        var pair = item.split('=')
        cookies[pair[0].trim()] = pair[1]
    })

    return cookies
}

/** session模块 */
var sessions = {}
var EXPIRES = 2 * 60 * 1000

var generate = () => {
    var session = {}

    session.id = (new Date()).getTime() + Math.random()
    session.cookie = {
        expire: (new Date()).getTime() + EXPIRES
    }
    sessions[session.id] = session

    console.log('session 是:', session)

    return session
}

var getUrl = function (_url, key, value) {
    var obj = url.parse(_url, true)
    // obj.query[key] = value
    obj.search += `&${key}=${value}`
    return url.format(obj)
}

var redirect = function (req, res, url) {
    res.setHeader('Location', url)
    res.writeHead(302)
    res.end()
}

/** 加密 */
var sign = function (val, secret) {
    var key = crypto
        .createHmac('sha256', secret)
        .update(`${val}`)
        .digest('base64')
        .replace(/\=+$/, '')

    return `${val}.${key}`
}

/** 解密 */
var unsign = function (val, secret) {
    var str = val.slice(0, val.lastIndexOf('.'))
    return sign(str, secret) == val ? str : false
}

/** control 模块 */
var handles = {
    index: {
        index: function (req, res) {
            /** 读取静态文件 */
            fs.readFile(path.resolve(__dirname, `../doc/index.html`), (err, file) => {
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
        },
        cookie: (req, res) => {
            if (!req.cookies.isVisit) {
                res.setHeader('Set-Cookie', serialize('isVisit', '1'))
                res.writeHead(200)
                res.end('welcome first time!')
            } else {
                res.writeHead(200)
                res.end('welcome back')
            }

        },
        session: (req, res) => {

            var writeHead = res.writeHead

            res.writeHead = function () {
                var cookies = res.getHeader('Set-Cookie')
                var session = serialize('session_id', sign(req.session.id, 'secret'))
                cookies = Array.isArray(cookies) ? cookies.concat(session) : [cookies, session]
                res.setHeader('Set-Cookie', cookies)
                return writeHead.apply(this, arguments)
            }

            if (!req.session.isVisit) {
                res.session = req.session
                res.session.isVisit = true
                res.writeHead(200)
                res.end('welcome first time!')
            } else {
                console.log(`看看真假:${!req.session.isVisit}`)
                res.writeHead(200)
                res.end('welcome back')
            }
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
    req.query = query
    console.log('查询字符串:', query)

    req.cookies = parseCookie(req.headers.cookie)

    console.log('查询 url', querystring.parse(req.url))

    /** session_with_cookie */
    var session_id = req.cookies['session_id']

    if (!session_id) {
        req.session = generate()
    } else {
        /** 解码 */
        session_id = unsign(session_id, 'secret')

        var session = sessions[session_id]
        if (session) {
            if (session.cookie.expire > (new Date()).getTime()) {
                session.cookie.expire = (new Date()).getTime() + EXPIRES
                req.session = session
            } else {
                delete sessions['session_id']
                req.session = generate()
            }
        } else {
            req.session = generate()
        }
    }

    // var id = req.query['session_id']

    // if (!id) {
    //     var session = generate()
    //     console.log(getUrl(req.url, 'session_id', session.id))
    //     redirect(req, res, getUrl(req.url, 'session_id', session.id))
    // } else {
    //     var session = sessions[id]

    //     if (session) {
    //         if (session.cookie.expire > (new Date()).getTime()) {
    //             session.cookie.expire = (new Date()).getTime() + EXPIRES
    //             req.session = session
    //         } else {
    //             delete sessions[id]
    //             var session = generate()
    //             redirect(req, res, getUrl(req.url, 'session_id', session.id))
    //             return
    //         }
    //     } else {
    //         var session = generate()
    //         redirect(req, res, getUrl(req.url, 'session_id', session.id))
    //         return;
    //     }
    // }


    /** 路由控制器 */
    if (handles[controller] && handles[controller][action]) {
        handles[controller][action].apply(null, [req, res].concat(args))
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('port', 8000)
})