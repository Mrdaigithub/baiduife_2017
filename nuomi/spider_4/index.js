"use strict";

const app = new Vue({
    data:{
        keyword: '',
        deviceName:'iPhone5',
        result: ''
    },
    methods:{
        submit(){
            axios.post('http://127.0.0.1:8080/',`keyword=${this.keyword}&deviceName=${this.deviceName}`)
                .then(res=>{
                    this.result = res.data
                })
                .catch(err=>{
                    console.error(`err ${err}`)
                })
            this.keyword = ''
        }
    }
}).$mount('#app')
