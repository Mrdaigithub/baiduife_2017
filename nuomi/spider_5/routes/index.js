"use strict";

const {Ife} = require('../database/index')
const Router = require('koa-router')
const router = new Router()

const spider = require('../task')

router.get('/', async(ctx, next) => {
    await ctx.render('index')
})
router.post('/task', async(ctx, next) => {
    let {keyword, devices, pageNum} = ctx.request.body
    let result = await spider(keyword, devices, pageNum)
    db.on('error', console.error.bind(console, 'connection error:'))
    db.once('open', (cb) => console.log('connection success'))
    new Ife(result)
    ctx.body = result
})

module.exports = router
