"use strict";

import Vue from 'vue'
import VueSocketio from 'vue-socket.io'

Vue.use(VueSocketio, 'http://127.0.0.1:8080')

const app = new Vue({
    data: {
        keyword: 'java',
        pageNum: 1,
        devices: ['iPhone5', 'iPhone6', 'iPad', 'iPhone7', 'iPhone8', 'iPhone9'],
        result: [],
        totalProcessNum: 0,
        completedProcessNum: 0
    },
    computed: {
        startState: function () {
            return !!this.keyword && this.pageNum > 0 && !!this.devices.length
        },
        processVal: function () {
            return this.completedProcessNum / this.totalProcessNum * 100
        }
    },
    methods: {
        start: function () {
            this.$socket.emit('start', {
                keyword: this.keyword,
                devices: this.devices,
                pageNum: this.pageNum * 10 - 10
            })
        }
    },
    sockets: {
        connect: function () {
            console.log('socket connected')
        },
        started: function (res) {
            res.dataList.forEach(function (each) {
                if (each.pic){
                    let picArr = each.pic.split('/').slice(-2)
                    each.pic = `${picArr[0]}/${picArr[1]}`
                }
                each.device = res.device
                app.result.unshift(each)
            })
            this.totalProcessNum = res.totalProcessNum
            this.completedProcessNum = res.completedProcessNum
        }
    }
}).$mount('#app')
