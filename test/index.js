
const express = require('../')
const app = express()

app.get('/', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    })

    res.end('404')
})

app.listen(3000, () => {
    console.log('listening')
})

