const express = require('express')
const router = express.Router()
const ejs = require('ejs')
const formidable = require('formidable')
const fs = require('fs')
/* const multer = require('multer') */

/* const upload = multer() */

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/file', (req, res) => {
    let path = './' + req.query.path
    
    if(fs.existsSync(path)) {
        fs.readFile(path, (err, data) => {
            if(!err) {
                res.end(data)
            } else {
                console.error(err)
                res.status(400).json({
                    error: err
                })
            }
        })
    } else {
        res.status(404).json({
            error: 'File not found'
        })
    }
})

router.post('/upload', /* upload.single('input-file'), */ (req, res) => {
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
                    if(!err) {
                        res.json({
                            fields
                        })
                    } else {
                        res.status(400).json({
                            err
                        })
                    }
                })
                } else {
                    res.status(404).json({
                        error: 'File not found'
                    })
                }
        } else {
            console.log(err)
        }
    })
})

module.exports = router