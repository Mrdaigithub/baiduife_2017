function createProcess({keyword, devices, pageNum}) {
    return devices.map(each => {
        return {keyword, device: each, pageNum}
    })
}


module.exports = function (app, port) {
    const spider = require('../task')
    const server = require('http').createServer(app.callback())
    const io = require('socket.io')(server)

    let totalProcess = [],
        waitProcess = [],
        currentProcess = [],
        completedProcess = [],
        processClock = false

    io.on('connection', socket => {
        console.log('a user connected');
        socket.on('disconnect', function () {
            console.log('user disconnected')
        })
        socket.on('start', async({keyword, devices, pageNum}) => {
            let process = createProcess({keyword, devices, pageNum}) // 新增进程
            waitProcess = waitProcess.concat(process) // 待处理进程
            if (processClock) return
            processClock = true
            if (currentProcess.length < 5) currentProcess = currentProcess.concat(waitProcess.splice(0, 5 - currentProcess.length)) // 处理队列中的进程
            while (currentProcess.length) {
                if (currentProcess.length < 5) currentProcess = currentProcess.concat(waitProcess.splice(0, 5 - currentProcess.length)) // 处理队列中的进程
                let result = await spider(currentProcess.shift())
                io.emit('started', result)
            }
            processClock = false
        });
    })

    server.listen(port, () => {
        console.log(`serverStatic listen to ${port} port`)
    })
}