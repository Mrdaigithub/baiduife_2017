"use strict";

class Observer {
    constructor(data) {
        this.data = data
        this.walk(data)
    }

    walk(obj) {
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                let val = obj[i]
                if (Object.prototype.toString.call(val) === '[object Object]') {
                    new Observer(val)
                }
                this.convert(i, val)
            }
        }
    }

    convert(key, val) {
        Object.defineProperty(this.data, key, {
            enumerable: true,
            configurable: true,
            get(){
                console.log(`你访问了 ${key}`)
                return val
            },
            set(newVal){
                if (Object.prototype.toString.call(newVal) === '[object Object]') {
                    new Observer(newVal)
                }
                console.log(`你设置了 ${key}，新的值为${newVal}`)
                val = newVal
            }
        })
    }
}


class Pubsub{
    constructor(){
        this.handlers = {}
    }
    on(eventType,handler){
        if (!this.handlers.hasOwnProperty(eventType)){
            this.handlers[eventType] = []
        }
        this.handlers[eventType].push(handler)
        return this
    }
    emit(eventType,...args){
        this.handlers[eventType].forEach((handler)=>{
            handler(args)
        })
    }
}



let pubsub = new Pubsub()

pubsub.on('A',function(data){

    console.log(1 + data);  // 执行第一个回调业务函数

});

pubsub.on('A',function(data){

    console.log(2 + data); // 执行第二个业务回调函数

});

setTimeout(function () {
    // 触发事件A

    pubsub.emit('A',"我是参数");
},2000)





// let app1 = new Observer({
//     name: 'youngwind',
//     age: 25
// });
//
// app1.data.name = {
//     lastName: 'liang',
//     firstName: 'shaofeng'
// };
//
// app1.data.name.lastName;
// // 这里还需要输出 '你访问了 lastName '
// app1.data.name.firstName = 'lalala';
// // 这里还需要输出 '你设置了firstName, 新的值为 lalala'
