"use strict";

const http = require('http')
const url = require('url')
const child_process = require('child_process')
const iconv = require('iconv-lite')

const app = http.createServer((req,res)=>{
    res.writeHead(200,{
        'Content-Type':'text/plain;charset=gb2312',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0.14393; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2950.5 Safari/537.36'
    })
    let urlObj = url.parse(req.url,true)
    let wd = urlObj.query['wd']
    child_process.exec(`phantomjs ./task.js ${wd}`,(err,stdout,stderr)=>{
        if (err) throw err
        if (stderr) throw `stderr: ${stderr}`
        console.log(`stdout: ${iconv.decode(stdout,'gbk')}`)
        // res.write(JSON.stringify(stdout,null,4))
        res.end()
    })
})

app.listen(8000,()=>{
    console.log('server is running')
})
