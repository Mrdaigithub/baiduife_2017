"use strict";

const mongoose = require('mongoose')

const db = mongoose.connection
mongoose.Promise = global.Promise
mongoose.connect('mongodb://127.0.0.1:27017/ifesql')

const ifeSchema = mongoose.Schema({
    code: Number,
    msg: String,
    word: String,
    time: Number,
    dataList: [{
        info: String,
        link: String,
        pic: String,
        title: String,
    }],
    device: String
})

const Ife = mongoose.model('Ife', ifeSchema)

db.on('error', console.error.bind(console, 'database connection error:'))
db.once('open', (cb) => console.log('database connection success'))

module.exports = {
    Ife
}
