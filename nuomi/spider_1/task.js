"use strict";

var page = require('webpage').create()
var system = require('system')

phantom.outputEncoding = 'gbk';
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0.14393; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2950.5 Safari/537.36'


var startTime = (new Date()).getTime()
var url = encodeURI('https://baidu.com/s?wd=' + system.args[1])
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
