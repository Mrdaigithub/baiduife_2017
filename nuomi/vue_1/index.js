"use strict";

class Observer{
    constructor(data){
        this.data = {}
        this.walk(data)
    }
    walk(obj){
        for (let i in obj){
            if (obj.hasOwnProperty(i)){
                let val = obj[i]
                if (Object.prototype.toString.call(val) === '[object Object]'){
                    new Observer(val)
                }
                this.convert(i,val)
            }
        }
    }
    convert(key,val){
        Object.defineProperty(this.data,key,{
            enumerable: true,
            configurable: true,
            get(){
                console.log(`你访问了 ${key}`)
                return val
            },
            set(newVal){
                console.log(`你设置了 ${key}，新的值为${newVal}`)
            }
        })
    }
}

let app1 = new Observer({
    name: 'youngwind',
    age: 25
});

let app2 = new Observer({
    university: 'bupt',
    major: 'computer'
});

// 要实现的结果如下：
app1.data.name // 你访问了 name
app1.data.age = 100;  // 你设置了 age，新的值为100
app2.data.university // 你访问了 university
app2.data.major = 'science'  // 你设置了 major，新的值为 science
