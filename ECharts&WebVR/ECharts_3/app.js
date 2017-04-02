"use strict";

let fs = require('fs')
const http = require('http');

const hostname = '0.0.0.0';
const port = 3000;


/**
 * 文件预处理
 * @param filename1
 * @param filename2
 * @param done
 */
function pretreatment(filename1, filename2, done) {
    let input = fs.createReadStream(filename1)
    let output = fs.createWriteStream(filename2)
    let res = []

    input.on('data', function (d) {
        res = JSON.stringify(
            d
            .toString()
            .split(/\r|\n/).filter(e=>e)
            .map(e=>e.split(','))
        )
        res = res.substring(0, res.length-1)
        output.write(res)
    })
    input.on('error', function (err) {
        throw err
    })
    input.on('end', function () {
        output.end(']')
        if (done) done()
    });
}

fs.exists('./sp500hst.txt', exists => {
    if (!exists) throw 'file not exists'
    pretreatment('./sp500hst.txt', './sp500hst.json', () => {
        const server = http.createServer((req, res) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/json');
            fs.readFile('./sp500hst.json', (err, data)=>{
                res.end(data);
            })
        });

        server.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`);
        });
    })
})
