const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.render('admin/index')
})

router.get('/contacts', (req, res, next) => {
    res.render('admin/contacts')
})

router.get('/emails', (req, res, next) => {
    res.render('admin/emails')
})

router.get('/login', (req, res, next) => {
    res.render('admin/login')
})

router.get('/menus', (req, res, next) => {
    res.render('admin/menus')
})

router.get('/reservations', (req, res, next) => {
    res.render('admin/reservations')
})

router.get('/users', (req, res, next) => {
    res.render('admin/users')
})

module.exports = router 