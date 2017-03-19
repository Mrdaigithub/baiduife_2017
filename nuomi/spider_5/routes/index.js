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
    ctx.body = result
    result.forEach(e=>{
        new Ife(e).save((err,content)=>{
            if (err) throw err
            console.log('save success')
        })
    })
})

module.exports = router
