"use strict"

const http = require('http')
const url = require('url')
const child_process = require('child_process')
const database = require('./database')

const db = database.db
const Ife = database.Ife

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
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', (cb) => console.log('connection success'))
        let resultJson = new Ife(stdout)
        resultJson.save((err, doc) => {
            if (err) throw err
            console.log('save success')
            res.end(JSON.stringify(doc, null, 4))
        })
    })
})

app.listen(8000, () => {
    console.log('server is running')
})
