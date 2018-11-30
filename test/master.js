var cp = require('child_process')
var cpus = require('os').cpus()
var net = require('net')

var server = net.createServer()
server.listen(1337)

var workers = {}

/** create worker */
var createWorker = function () {
    var worker = cp.fork('./worker.js')

    worker.on(`message`, (msg) => {
        if (msg.act === 'suicide') {
            createWorker()
        }
    })

    /** reload when exit */
    worker.on('exit', () => {
        console.log(`worker ${worker.pid} exited`)
        delete workers[worker.pid]
        // createWorker()
    })

    /** send sentence */
    worker.send(`server`, server)

    workers[worker.pid] = worker

    console.log(`create worker.pid: ${worker.pid}`)
}

for (var i = 0; i < cpus.length; i++) {
    createWorker()
}

process.on(`exit`, () => {
    for (var pid in workers) {
        workers[pid].kill()
    }
})

