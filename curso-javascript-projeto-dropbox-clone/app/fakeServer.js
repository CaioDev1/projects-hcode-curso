const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')

const app = express()

app.use(express.static('public'))
app.use(require('./routes/fakeIndex.js'))
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))

app.set('view engine', 'ejs')

app.listen(3000, () => {
    console.log('servidor iniciado naquele pique')
})