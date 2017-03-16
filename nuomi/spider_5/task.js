const phantoms = require('phantom')
const request = require('superagent')
const fs = require('fs')

const devices = require('./devices.json')

const picDir = `${__dirname}/static/pic`


/**
 * 下载图片
 * @param picUrl
 * @returns {Promise}
 */
function downloadPic(picUrl) {
    return new Promise((resolve, reject)=>{
        let picName = `${new Date().getTime()}.jpg`
        request
            .get(picUrl)
            .end(function (err, res) {
                fs.writeFile(`${picDir}/${picName}`, res.body, function (err) {
                    if (err) reject(err)
                    resolve(`${picDir}/${picName}`)
                })
            })
    })
}


async function spider(keyword, deviceName) {
    try{
        let url = `https://www.baidu.com/s?wd=${keyword}`
        let device = devices[deviceName]
        let instance = await phantoms.create([], {logLevel: 'error'})
        let page = await instance.createPage()
        let startTime = new Date()
        let status = await page.open(url);
        if (status !== 'success') throw Error({message: 'open failed'})
        if (deviceName) {
            page.setting('userAgent', device.userAgent)
            page.property('viewportSize', {
                width: device.viewportSize.split('*')[0],
                height: device.viewportSize.split('*')[1]
            })
        }
        let dataList = await page.evaluate(function () {
            return $('#content_left .result.c-container').map(function () {
                return {
                    title: $(this).find('.t').text() || '',
                    url: $(this).find('.t > a').attr('href') || '',
                    info: $(this).find('.c-abstract').text() || '',
                    pic: $(this).find('.c-img').attr('src') || ''
                }
            }).toArray();
        })
        for (let each of dataList){
            if (!each.pic) continue
            each.pic = await downloadPic(each.pic)
        }
        let result = {
            code: 1,
            msg: '抓取成功',
            word: keyword,
            device: deviceName,
            time: Date.now() - startTime,
            dataList
        }
        await instance.exit()
        return result
    }catch (err){
        return {code:0, msg: '抓取失败', err: err.message}
    }
}

module.exports = spider
