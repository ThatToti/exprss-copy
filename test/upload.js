
var http = require('http')
var fs = require('fs')
var crypto = require('crypto')
var querystring = require('querystring')

/** 生成随机数 */
var generateRandom = function (len) {
	return crypto.randomBytes(Math.ceil(len * 3 / 4))
		.toString('base64')
		.slice(0, len)
}

/** 判断是否有 body 字段  */
var hasBody = function (req) {
	return 'transfer-encoding' in req.headers || 'content-length' in req.headers
}

var handle = function (req, res) {

	let type = req.headers['content-type'].split(';')[0]

	/** form */
	if (type === 'application/x-www-form-urlencoded') {
		req.body = querystring.parse(req.rawBody)

		/** json */
	} else if (type === 'application/json') {
		req.body = Json.parse(req.rawBody)

		/** xml */
	} else if (type === 'application/xml') {
		//xml 中间件去解析
	}

	res.writeHead(200, "OK")
	res.end('form submit')
}

var server = http.createServer((req, res) => {

	if (hasBody(req)) {
		var buffers = []

		req.on('data', (chunk) => {
			buffers.push(chunk)
		})

		req.on('end', () => {
			req.rawBody = Buffer.concat(buffers).toString()
			handle(req, res)
		})
	} else {
		handle(req, res)
	}
})

server.listen(8000)