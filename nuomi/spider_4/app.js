"use strict"

const child_process = require('child_process')
const Koa = require('koa')
const koaBody = require('koa-body')
const app = new Koa()

app.use(koaBody({formidable:{uploadDir: __dirname}}))

app.use(async (ctx,next)=>{
    ctx.set({
        'Access-Control-Allow-Origin': '*',
        'Server': 'Koa2'
    })
    if (ctx.method === 'POST'){
        ctx.status = 200
        ctx.set('Content-Type', 'text/plain')
        ctx.body = 'hello world!'
        console.log(ctx.request.body)
        // let command = `phantomjs task.js ${ctx.request.body.keyword} ${ctx.request.body.deviceName}`
        // console.log(command)
        // child_process.exec(command,(err, stdout, stderr)=>{
        //     if (err) throw err
        //     if (stderr) throw `stderr: ${stderr}`
        //     console.log(`stdout: ${stdout}`)
        // })
    }else{
        ctx.status = 500
        ctx.set('Content-Type', 'text/plain')
        ctx.body = 'Request error'
    }
})

app.listen(8080)

