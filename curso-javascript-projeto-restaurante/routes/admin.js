const express = require('express')
const router = express.Router()

const users = require('../inc/users')
const admin = require('../inc/admin')
const menus = require('../inc/menus')

router.use(function(req, res, next) {
    if(['/login'].indexOf(req.url) == -1 && !req.session.user) {
        res.redirect('/admin/login')
    } else {
        next()
    }
})

router.use(function(req, res, next) {
    req.menus = admin.getMenus(req.url)

    next()
})

router.get('/', (req, res, next) => {
    admin.dashboard().then(results => {
        res.render('admin/index', admin.getParams(req, {
            data: results
        }))
    }).catch(err => {
        console.log(err)
    })
})

router.get('/contacts', (req, res, next) => {
    res.render('admin/contacts', {
        menus: req.menus,
        user: req.session.user
    })
})

router.get('/emails', (req, res, next) => {
    res.render('admin/emails', admin.getParams(req))
})

router.get('/login', (req, res, next) => {
    users.render(req, res, null)
})

router.post('/login', (req, res, next) => {
    if(!req.body.email) {
        users.render(req, res, 'Insira o email')
    } else if(!req.body.password) {
        users.render(req, res, 'Insira a senha')
    } else {
        users.login(req.body.email, req.body.password).then(results => {
            req.session.user = results

            res.redirect('/admin')
        }).catch(err => {
            users.render(req, res , err.message || err)
        })
    }
})

router.get('/logout', (req, res, next) => {
    delete req.session.user

    res.redirect('/admin/login')
})

router.get('/menus', (req, res, next) => {
    menus.getMenus().then(results => {
        res.render('admin/menus', admin.getParams(req, {
            data: results
        }))
    }).catch(err => {
        console.log(err)
    })
})

router.get('/reservations', (req, res, next) => {
    res.render('admin/reservations', admin.getParams(req, {
        date: {}
    }))
})

router.get('/users', (req, res, next) => {
    res.render('admin/users', admin.getParams(req))
})

module.exports = router