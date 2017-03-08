"use strict";

const app = new Vue({
    data:{
        keyword: '',
        deviceModel:'iPhone5',
        res:''
    },
    methods:{
        submit(){
            axios.post('http://127.0.0.1:8080/', {
                keyword: this.keyword,
                deviceModel: this.deviceModel
            })
                .then(function (response) {
                    this.res = response
                })
                .catch(function (error) {
                    console.error(error);
                });
        }
    }
}).$mount('#app')
