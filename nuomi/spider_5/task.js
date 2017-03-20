const phantoms = require('phantom')
const request = require('superagent')
const fs = require('fs')

const deviceCfg = require('./devices.json')

const picDir = `${__dirname}/static/pic`


/**
 * 下载图片
 * @param picUrl
 * @returns {Promise}
 */
function downloadPic(picUrl) {
    return new Promise((resolve, reject) => {
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


async function spider({keyword, device, pageNum}) {
    try {
        let url = encodeURI(`https://www.baidu.com/s?wd=${keyword}&pn=${pageNum}`)
        let instance = await phantoms.create([], {logLevel: 'error'})
        let page = await instance.createPage()
        let startTime = new Date()
        let status = await page.open(url);
        if (status !== 'success') throw Error({message: 'open failed'})
        if (device) {
            page.setting('userAgent', deviceCfg[device].userAgent)
            page.property('viewportSize', {
                width: deviceCfg[device].viewportSize.split('*')[0],
                height: deviceCfg[device].viewportSize.split('*')[1]
            })
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
            for (let each of dataList) {
                if (!each.pic) continue
                each.pic = await downloadPic(each.pic)
            }
            await instance.exit()
            return {
                code: 1,
                msg: '抓取成功',
                word: keyword,
                time: Date.now() - startTime,
                device,
                dataList
            }
        }
    } catch (err) {
        return {code: 0, msg: '抓取失败', err: err.message}
    }
}

module.exports = spider
