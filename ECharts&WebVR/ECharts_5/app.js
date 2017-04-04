"use strict";

let fs = require('fs')
const koa = require('koa')
const serve = require('koa-static');
const views = require('koa-views');
const csv = require('csvtojson')
const app = new koa()

const Ticker = 'A'

app.use(serve('.'));
app.use(views(__dirname))
app.use(async function (ctx) {
    await ctx.render('index.html')
})


let data = []
let csvReadStream = fs.createReadStream('sp500hst.txt')

csv()
    .fromStream(csvReadStream)
    .on('csv', (csvRow) => {
        if (csvRow[1] === Ticker){
            csvRow.splice(1,1)
            data.push(csvRow)
        }
    })
    .on('done', (error) => {
        if (error) throw error
        fs.writeFile('sp500hst.json', JSON.stringify(data), err => {
            if (err) throw err
            console.log('It\'s saved!');
            app.listen(8080);
            console.log('server is running!')
        })
    })
