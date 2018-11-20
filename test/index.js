
const express = require('../')
const app = express()

app.get('/', (req, res) => {
    console.log('request')
})

app.listen(3000, () => {
    console.log('listening')
})

