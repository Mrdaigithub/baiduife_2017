"use strict";

let fs = require('fs')
const koa = require('koa')
const serve = require('koa-static');
const views = require('koa-views');
const app = new koa()


app.use(serve('.'));
app.use(views(__dirname))
app.use(async function (ctx) {
    await ctx.render('index.html')
})
app.listen(8080);