const router = require('express').Router()
const ejs = require('ejs')
const formidable = require('formidable')
const fs = require('fs')

router.get('/', (req, res) => {
    res.render('index')
})

router.post('/upload', (req, res) => {
    let form = new formidable.IncomingForm({
        uploadDir: './uploads',
        keepExtensions: true
    })

    form.parse(req, (err, fields, files) => {
        if(!err) {
            res.json({
                files
            })
        } else {
            console.log(err)
        }
    })
})

router.delete('/file', (req, res) => {
    let form = new formidable.IncomingForm({
        uploadDir: './uploads',
        keepExtensions: true
    })

    form.parse(req, (err, fields, files) => {
        if(!err) {
            let path = './' + fields.path

            if(fs.existsSync(path)) {
                fs.unlink(path, err => {
                    if(err) {
                        res.status(400).json({
                            err
                        })
                    } else {
                        res.json({
                            fields
                        })
                    }
                })
            }
        } else {
            console.log(err)
        }
    })
})

module.exports = router