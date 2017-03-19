"use strict";

const Koa = require('koa')
const serverStatic = require('koa-static')
const views = require('koa-views')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)
const router = require('./routes/index')
const spider = require('./task')

app
    .use(logger())
    .use(serverStatic(`${__dirname}/static`))
    .use(views(`${__dirname}/views`))
    .use(bodyParser())
    .use(router.routes())

io.on('connection', socket => {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected')
    })
    socket.on('start', async ({keyword, devices, pageNum}) =>{
        let result = await spider(keyword, devices, pageNum)
        io.emit('started', result)
    });
})

server.listen(8080, () => {
    console.log('serverStatic listen to 8080 port')
})
