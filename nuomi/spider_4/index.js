"use strict";

const app = new Vue({
    data:{
        keyword: '',
        deviceName:'iPhone5',
        res:''
    },
    methods:{
        submit(){
            axios.post('http://127.0.0.1:8080/',JSON.stringify({keyword:this.keyword, deviceName:this.deviceName}))
                .then(res=>{
                    this.res = res.data
                })
                .catch(err=>{
                    console.error(`err ${err}`)
                })
            this.keyword = ''
        }
    }
}).$mount('#app')
