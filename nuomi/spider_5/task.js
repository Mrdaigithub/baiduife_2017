const phantoms = require('phantom')
const request = require('superagent')
const fs = require('fs')

const devices = require('./devices.json')

async function spider(keyword, deviceName) {
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
    console.log(dataList)
}

function downloadPic(picUrl) {
    pro
}

console.log(downloadPic('https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'))

module.exports = spider
