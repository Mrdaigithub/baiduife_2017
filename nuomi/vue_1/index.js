"use strict";

class Observer{
    constructor(data){
        this.data = data
        this.walk(data)
    }
    walk(data){
        if (Object.prototype.toString.call(data) === '[object Object]'){
            for (let i in data){
                console.log(i)
                this.walk(i)
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

