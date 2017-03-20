"use strict";

const Koa = require('koa')
const serverStatic = require('koa-static')
const views = require('koa-views')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const router = require('./routes/index')
const socketWorker = require('./socket/index')

app
    .use(logger())
    .use(serverStatic(`${__dirname}/static`))
    .use(views(`${__dirname}/views`))
    .use(bodyParser())
    .use(router.routes())

socketWorker(app, '8080')
