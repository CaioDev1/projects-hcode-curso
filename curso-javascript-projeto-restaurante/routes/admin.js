const express = require('express')
const router = express.Router()

const users = require('../inc/users')
const admin = require('../inc/admin')
const menus = require('../inc/menus')
const reservations = require('../inc/reservations')
const contacts = require('../inc/contacts')
const emails = require('../inc/emails')

const moment = require('moment') 

module.exports = function(io) {
    moment.locale('pt-BR')

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
    
    router.get('/dashboard', (req, res, next) => {
        reservations.dashboard().then(results => {
            res.send(results)
        }).catch(err => {
            res.send(err)
        })
    })
    
    router.get('/contacts', (req, res, next) => {
        contacts.getContacts().then(results => {
            res.render('admin/contacts', admin.getParams(req, {
                data: results
            }))
        }).catch(err => {
    
        })
    })
    
    router.delete('/contacts/:id', (req, res, next) => {
        contacts.delete(req.params.id).then(results => {
            io.emit('dashboard update')
            res.send(results)
        }).catch(err => {
            res.send(err)
        })
    })
    
    router.get('/emails', (req, res, next) => {
        emails.getEmails().then(results => {
            res.render('admin/emails', admin.getParams(req, {
                data: results
            }))
        }).catch(err => {
            res.send(err)
        })
    })
    
    router.delete('/emails/:id', (req, res, next) => {
        emails.delete(req.params.id).then(results => {
            io.emit('dashboard update')
            res.send(results)
        }).catch(err => {
            res.send(err)
        })
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
    
    router.post('/menus', (req, res, next) => {
        menus.save(req.fields, req.files).then(results => {
            io.emit('dashboard update')
            res.send(results)
        }).catch(err => {
            res.send(err)
        })
    })
    
    router.delete('/menus/:id', (req, res, next) => {
        menus.delete(req.params.id).then(result => {
            io.emit('dashboard update')
            res.send(results)
        }).catch(err => {
            res.send(err)
        })
    })
    
    router.get('/reservations', (req, res, next) => {
        let start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD')
        let end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD')
        reservations.getReservations(req).then(pag => {
            res.render('admin/reservations', admin.getParams(req, {
                date: {
                    start,
                    end
                },
                data: pag.results,
                moment,
                links: pag.links
            }))
        })
    })
    
    router.post('/reservations', (req, res, next) => {
        reservations.save(req.fields).then(results => {
            io.emit('dashboard update')
            res.send(results)
        }).catch(err => {
            res.send(err)
        })
    })
    
    router.delete('/reservations/:id', (req, res, next) => {
        reservations.delete(req.params.id).then(results => {
            io.emit('dashboard update')
            res.send(results)
        }).catch(err => {
            res.send(err)
        })
    })
    
    router.get('/reservations/chart', (req, res, next) => {
        req.query.start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD')
        req.query.end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD')
    
        reservations.chart(req).then(results => {
            res.send(results)
        }).catch(err => {
            res.send(err)
        })
    })
    
    router.get('/users', (req, res, next) => {
        users.getUsers().then(results => {
            res.render('admin/users', admin.getParams(req, {
                data: results
            }))
        }).catch(err => {
            console.log(err)
        })
    })
    
    router.post('/users', (req, res, next) => {
        users.save(req.fields).then(results => {
            io.emit('dashboard update')
            res.send(results)
        }).catch(err => {
            res.send(err)
        })
    })
    
    router.delete('/users/:id', (req, res, next) => {
        users.delete(req.params.id).then(results => {
            io.emit('dashboard update')
            res.send(results)
        }).catch(err => {
            res.send(err)
        })
    })
    
    router.post('/users/password-change', (req, res, next) => {
        users.changePassword(req).then(results => {
            res.send(results)
        }).catch(err => {
            res.send({
                error: err
            })
        })
    })

    return router
}