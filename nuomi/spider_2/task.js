"use strict";

var page = require('webpage').create()
var system = require('system')

phantom.outputEncoding = 'gbk';
page.settings.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
page.settings.viewportSize = {
    width: 320,
    height: 568
}


var startTime = (new Date()).getTime()
var wd = system.args[1]
var deviceName = system.args[2]
var url = encodeURI('https://baidu.com/s?wd=' + wd)
var data = {
    code:1,
    msg:'抓取成功',
    word:system.args[1] || '',
    time:0,
    dataList:[]
}

page.open(url,function (s) {
    if (s === 'success'){
        var dataList = page.evaluate(function () {
            var dataList = []
            $('.result').each(function (index) {
                dataList[index] = {
                    title:$(this).find('.t').text()||'',
                    info:$(this).find('.c-abstract').text()||'',
                    link:$(this).find('a').attr('href')||'',
                    pic:$(this).find('.c-img').attr('src')||''
                }
            })
            return dataList
        })
    }else {
        data.code = 0
        data.msg = '抓取失败'
    }
    page.render('search.jpg')
    data['dataList'] = dataList
    data.time = (new Date()).getTime() - startTime
    console.log(JSON.stringify(data,null,4))
    phantom.exit()
})
