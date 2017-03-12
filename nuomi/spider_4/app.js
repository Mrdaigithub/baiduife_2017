"use strict"

const child_process = require('child_process')
const url = require('url')
const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('koa-router')()
const request = require('request')
const app = new Koa()
const database = require('./database')

const db = database.db
const Ife = database.Ife

const imgDirPath = path.resolve(__dirname,'images')

// 如果图片文件夹不存在就创建
fs.exists(imgDirPath,exists=>{
    if (!exists){
        fs.mkdir(imgDirPath,777,err=>{
            if (err) throw err
            console.log(`create ${imgDirPath}`)
        })
    }
})


/**
 * 执行phantom命令
 * @param command
 * @returns {Promise}
 */
let execCommand = command=>{
    return new Promise((resolve, reject)=>{
        child_process.exec(command, (err, stdout, stderr)=>{
            if (err) reject(err)
            if (stderr) reject(stderr)
            resolve(JSON.parse(stdout))
        })
    })
}


/**
 * 下载图片到本地通过时间戳生成唯一ID
 * @param picUrl
 * @returns {Promise}
 */
let downloadPic = (picUrl) =>{
    return new Promise((resolve, reject)=>{
        request({
            url: picUrl,
            encoding: 'binary'
        },(err, response, picData)=>{
            if (err) reject(err)
            if (response.statusCode !== 200) reject('response statusCode error')
            let pic = `${imgDirPath}/${new Date().getTime()}.${response.headers['content-type'].split('/')[1]}`
            fs.writeFile(pic, picData, 'binary', pic_err=>{
                if (pic_err) reject(pic_err)
                resolve(pic)
            })
        })
    })
}

app.use(bodyParser())
app.use(router.routes())

var readFile = function (fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, function(error, data) {
            if (error) reject(error);
            resolve(data);
        });
    });
};


// router
router.post('/', async (ctx, next)=>{
    ctx.set({
        'Access-Control-Allow-Origin': '*',
        'Server': 'Koa2'
    })
    ctx.state.args = {}
    ctx.state.args.wd = ctx.request.body.keyword
    let command = `phantomjs task.js ${ctx.request.body.keyword} ${ctx.request.body.deviceName}`
})


// exec task.js to get json data and download picture in images direction
app.use(async (ctx, next)=>{
    ctx.state.args = {}
    ctx.state.args.wd = ctx.request.body.keyword
    let command = `phantomjs task.js ${ctx.request.body.keyword} ${ctx.request.body.deviceName}`
    async function asyncExecDownload () {
        let result = await execCommand(command)
        for (let each of result.dataList){
            if (!each.pic) continue
            each.pic = await downloadPic(each.pic)
        }
        return result
    }
    await new Promise((resolve, reject)=>{
        setTimeout(function () {
            ctx.body = 'asdsad'
            resolve()
        },1000)
        // next()
        // asyncExecDownload()
        //     .then(res=>{
        //         ctx.state.searchData = res
        //         // next()
        //     })
        //     .catch(err=>{console.log(`throw error in row 93: ${err}`)})
    })
})

// save the json data to mongodb database
app.use(async (ctx, next)=>{
    // db.on('error', console.error.bind(console, 'connection error:'))
    // db.once('open', (cb) => console.log('connection success'))
    // let resultJson = new Ife(ctx.state.searchData)
    // resultJson.save((err, res) => {
    //     if (err) throw err
    //     console.log('save success')
    //     // next()
    // })
})

// fetch data from mongodb database then response client
app.use(async (ctx, next)=>{
    Ife.findOne({'word':ctx.request.body.keyword},(err, datas)=>{
        if (err) throw err
        ctx.body = datas
    })
})


app.listen(8080)
