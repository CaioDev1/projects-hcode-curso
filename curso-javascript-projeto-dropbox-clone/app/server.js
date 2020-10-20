const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')

const app = express()

app.use(express.json({limit: '50mb'}))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))
app.set('view engine', 'ejs')

app.use(require('./routes/index'))

app.listen(3000, () => {
    console.log('server iniciado')
})