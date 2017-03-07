"use strict";


var fs = require('fs')
var page = require('webpage').create()
var system = require('system')
var devices = require('./devices.json')

var deviceName = system.args[2] || 'iPhone5'
var theDevice = devices[deviceName]
var startTime = (new Date()).getTime()
var wd = system.args[1]
var url = encodeURI('https://baidu.com/s?wd=' + wd)
var data = {
    code: 1,
    msg: '抓取成功',
    word: system.args[1] || '',
    time: 0,
    dataList: [],
    device: deviceName
}

phantom.outputEncoding = 'utf8';

page.settings.userAgent = theDevice['userAgent']
page.settings.viewportSize = {
    width: theDevice['viewportSize'].split('*')[0],
    height: theDevice['viewportSize'].split('*')[1]
}
page.clipRect = {
    top: 0, left: 0,
    width: theDevice['viewportSize'].split('*')[0],
    height: theDevice['viewportSize'].split('*')[1]
}


page.open(url, function (s) {
    if (s === 'success') {
        var dataList = page.evaluate(function () {
            var dataList = []
            $('.result').each(function (index) {
                dataList[index] = {
                    title: $(this).find('.t').text() || $(this).find('.c-title').text() || '',
                    info: $(this).find('.c-abstract').text() || $(this).find('.wa-bk-polysemy-clamp').text() || '',
                    link: $(this).find('a').attr('href') || '',
                    pic: $(this).find('img').attr('src') || ''
                }
            })
            return dataList
        })
    }
    else {
        data.code = 0
        data.msg = '抓取失败'
    }
    page.render('search.jpeg', {format: 'jpeg', qualiy: 100})
    data['dataList'] = dataList
    data.time = (new Date()).getTime() - startTime
    console.log(JSON.stringify(data, null, 4))
    phantom.exit()
})
