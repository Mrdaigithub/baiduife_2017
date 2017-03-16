"use strict";

const Router = require('koa-router')
const router = new Router()

const spider = require('../task')

router.get('/', async (ctx, next)=>{
    await ctx.render('index')
})
router.post('/task', async(ctx, next)=>{
    let {keyword, deviceName} = ctx.request.body
    let result = await spider(keyword, deviceName)
    ctx.body = result
})


module.exports = router
