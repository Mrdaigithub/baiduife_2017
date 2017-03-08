"use strict";

const Koa = require('koa')
const router = require('koa-router')()
const app = new Koa()

router.post('/', async (next)=>{
    next()
})
app.use(async (ctx,next)=>{
    console.log(ctx)
    ctx.body = 'asd'
})

app.use(router.routes())

app.listen(8080)



