"use strict";

class Observer {
    constructor(data) {
        this.data = new Proxy(data, {
            get: (target, key) => {
                console.log(`你访问了 ${key}`)
                return Reflect.get(target, key);
            },
            set: (target, key, newVal) => {
                console.log(`你设置了 ${key}，新的值为${newVal}`)
                return Reflect.set(target, key, newVal);
            }
        })
    }
}


let app1 = new Observer({
    name: 'youngwind',
    age: 25,
    friend:{
        lucks:'lucks',
        evenline:'evenline',
    }
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
