"use strict"

class Pubsub {
    constructor() {
        this.handlers = {}
    }

    on(eventType, cb) {
        if (!this.handlers.hasOwnProperty(eventType)) {
            this.handlers[eventType] = []
        }
        this.handlers[eventType].push(cb)
    }

    emit(eventType, ...args) {
        if (!this.handlers.hasOwnProperty(eventType)) return
        this.handlers[eventType].forEach(cb => {
            cb(...args)
        })
    }
}


class Observer {
    constructor(data) {
        this.data = data
        this.emitter = new Pubsub()
        this.walk(this.data)
    }
    walk(obj) {
        let val
        for (let key in obj) {
            val = obj[key]
            if (obj.hasOwnProperty(key)) {
                if (Object.prototype.toString.call(val) === "[object Object]") {
                    new Observer(val)
                }
                this.convert(key, val)
            }
        }
    }
    convert(key, val) {
        let self = this
        Object.defineProperty(this.data, key, {
            configurable: true,
            enumerable: true,
            get(){
                console.log('你访问了' + key);
                return val
            },
            set(newVal){
                if (val === newVal) return
                if (Object.prototype.toString.call(newVal) === "[object Object]"){
                    new Observer(newVal)
                }
                console.log(`你设置了 ${key}，新的值为${newVal}`)
                self.emitter.emit(key, newVal, val)
                val = newVal
            }
        })
    }
    $watch(key, cb){
        this.emitter.on(key, cb)
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





// 1. 获取图片源文件
// 2. 将图片全部重命名为timeStamp_md5
// 3. 将其存入ftp
// 4. 查询数据库获取全部文章body
// 5. 遍历body内的图片路径下载计算md5值与原图片文件名匹配
// 6. 相同就替换原图片的路径
