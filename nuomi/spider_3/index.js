"use strict";

const http = require('http')
const url = require('url')
const child_process = require('child_process')
const mongoose = require('mongoose')


const app = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json;charset=utf-8',
        'Server': 'nodejs'
    })
    let urlObj = url.parse(req.url, true)
    if (urlObj.pathname !== '/') return
    let wd = urlObj.query['wd']
    child_process.exec(`phantomjs.exe ./task.js ${wd}`, (err, stdout, stderr) => {
        if (err) throw err
        if (stderr) throw `stderr: ${stderr}`
        if (typeof stdout === 'string') stdout = JSON.parse(stdout)
        mongoose.connect('mongodb://127.0.0.1:27017/daisql')
        const database = mongoose.connection
        database.on('error', console.error.bind(console, 'connection error:'))
        database.once('open', (cb) => {
            let resultSchema = mongoose.Schema({
                code: Number,
                msg: String,
                word: String,
                time: Number,
                dataList: [{
                    info: String,
                    link: String,
                    pic: String,
                    title: String,
                }],
                device: String
            })
            let Result = mongoose.model('Result', resultSchema)
            let queryResult = new Result(stdout)
            queryResult.save((err, queryResult) => {
                if (err) throw err
                console.log('save success')
            })
        })
        res.end()
    })
})

app.listen(8000, () => {
    console.log('server is running')
})
