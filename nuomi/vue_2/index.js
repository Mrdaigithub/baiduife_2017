"use strict";

class Pubsub{
    constructor(){
        this.handlers = {}
    }

    // 注册事件
    on(eventType,cb){
        if (!this.handlers.hasOwnProperty(eventType)){
            this.handlers[eventType] = []
        }
        this.handlers[eventType].push(cb)
    }

    // 触发事件
    emit(eventType, ...args){
        if (!this.handlers.hasOwnProperty(eventType)) return
        this.handlers[eventType].forEach((handler)=>{
            handler(...args)
        })
    }
}

class Observer{
    constructor(data){
        this.data = data
        this.emitter = new Pubsub()
        this.walk(data)
    }
    walk(obj){
        for (let i in obj){
            if (obj.hasOwnProperty(i)){
                let val = obj[i]
                if (Object.prototype.toString.call(val) === '[object Object]'){
                    new Observer(val)
                }
                this.convert(i, val)
            }
        }
    }
    convert(key, val){
        let self = this
        Object.defineProperty(this.data, key, {
            configurable:true,
            enumerable:true,
            get(){
                console.log(`你访问了 ${key}`)
                return val
            },
            set(newVal){
                console.log(`你设置了 ${key}，新的值为${newVal}`)
                if (Object.prototype.toString.call(newVal) === '[object Object]'){
                    new Observer(newVal)
                }
                self.emitter.emit(key, newVal, val)
                val = newVal
            }
        })
    }
    $watch(key,cb){
        this.emitter.on(key,cb)
    }
}

let app2 = new Observer({
    name: {
        firstName: 'shaofeng',
        lastName: 'liang'
    },
    age: 25
});

app2.$watch('name', function (newName) {
    console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
});

app2.data.name.firstName = 'hahaha';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
app2.data.name.lastName = 'blablabla';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。

// // 你需要实现 $watch 这个 API
// app1.$watch('age', function(age) {
//     console.log(`我的年纪变了，现在已经是：${age}岁了`)
// });
//
// app1.data.age = 100; // 输出：'我的年纪变了，现在已经是100岁了'