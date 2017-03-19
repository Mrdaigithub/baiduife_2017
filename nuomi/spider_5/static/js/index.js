"use strict";

import Vue from 'vue'
import axios from 'axios'
import VueSocketio from 'vue-socket.io'

Vue.use(VueSocketio, 'http://127.0.0.1:8080')

const app = new Vue({
    data: {
        keyword: 'java',
        pageNum: 1,
        devices: [],
        result: []
    },
    computed: {
        startState: function () {
            return !!this.keyword && this.pageNum > 0 && !!this.devices.length
        }
    },
    methods: {
        start: function () {
            this.$socket.emit('start', {
                keyword: this.keyword,
                devices: this.devices,
                pageNum: this.pageNum * 10 - 10
            })
            // axios.post('/task', {
            //     keyword: this.keyword,
            //     devices: this.devices,
            //     pageNum: this.pageNum * 10 - 10
            // }).then(function (res) {
            //     app.result = []
            //     res.data.forEach(each => {
            //         each.dataList.forEach(data => {
            //             data.device = each.device
            //             var picArr = data.pic.split('/')
            //             if (data.pic) data.pic = picArr[picArr.length - 2] + '/' + picArr[picArr.length - 1]
            //             app.result.push(data)
            //         })
            //     })
            // }).catch(err => {
            //     console.error(err)
            // })
        }
    },
    sockets: {
        connect: function () {
            console.log('socket connected')
        },
        started: function (result) {
            console.log(result)
        }
    }
}).$mount('#app')
