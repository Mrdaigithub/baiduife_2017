"use strict";

const Koa = require('koa')
const server = require('koa-static')
const views = require('koa-views')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = require('./routes/index')


app
    .use(logger())
    .use(server(`${__dirname}/static`))
    .use(views(`${__dirname}/views`))
    .use(bodyParser())
    .use(router.routes())
    .listen(8080, ()=>{console.log('server listen to 8080 port')})
