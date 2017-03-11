"use strict"

const child_process = require('child_process')
const url = require('url')
const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const request = require('request')
const app = new Koa()

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
 * @returns {*}
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
            console.log(pic)
            fs.writeFile(pic, picData, 'binary', pic_err=>{
                if (pic_err) reject(pic_err)
                resolve(pic)
            })
        })
    })
}

app.use(bodyParser())

// router
app.use(async (ctx,next)=>{
    ctx.set({
        'Access-Control-Allow-Origin': '*',
        'Server': 'Koa2'
    })
    if (ctx.method === 'POST'){
        ctx.status = 200
        ctx.set('Content-Type', 'text/plain')
        next()
    }else{
        ctx.status = 500
        ctx.set('Content-Type', 'text/plain')
        ctx.body = 'Request error'
    }
})

// exec task.js to get json data
app.use(async (ctx,next)=>{
    let command = `phantomjs task.js ${ctx.request.body.keyword} ${ctx.request.body.deviceName}`
    async function asyncExecCommand () {
        let result = await execCommand(command)
        for (let each of result.dataList){
            if (!each.pic) continue
            await downloadPic(each.pic)
        }
    }
    asyncExecCommand()
    // child_process.exec(command,(err, stdout, stderr)=>{
    //     if (err) throw err
    //     if (stderr) throw `stderr: ${stderr}`
    //     let result = JSON.parse(stdout)
    //     result.dataList.forEach(each=>{
    //         let picUrl = each.pic
    //         if (!picUrl) return
    //         downloadPic(picUrl, pic=>{
    //             each.pic = pic
    //         })
    //     })
    // })
})

app.listen(8080)
