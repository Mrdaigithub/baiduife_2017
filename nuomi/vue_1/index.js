"use strict";

class Observer{
    constructor(data){
        this.data = data
        this.walk(data)
    }
    walk(data){
        for (let i in data){
            Object.defineProperty(this.data,)
            if (Object.prototype.toString.call(data[i]) === '[object Object]'){
                this.walk(data[i])
            }
        }
    }
}

let app1 = new Observer({
    name: 'youngwind',
    age: 25,
    friend:{
        'aaa':'aaaa',
        'bbb':'bbbb'
    }
})

console.log(app1)
