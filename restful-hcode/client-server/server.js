const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')

const app = express()

app.use(bodyParser.json({limit: '50mb'}))
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.use('/users', require('./users'))

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(3000, () => {
    console.log('server iniciado na porta 3000')
})