var express = require('express');
var router = express.Router();

var connection = require('../inc/db')

/* GET home page. */
router.get('/', (req, res, next) => {
  connection.query(`
    SELECT * FROM tb_menus ORDER BY title
  `, (err, results) => {
    if(err) {
      console.log(err)
    }
      res.render('index', { 
        title: 'Restaurante Saboroso',
        menus: results
      });
  })
});


router.get('/contacts', (req, res, next) => {
  res.render('contacts', {
    title: 'Contato - Restaurante Saboroso',
    headerBackgroundImg: 'images/img_bg_3.jpg',
    headerTitle: 'Diga um oi!'
  })
})

router.get('/menus', (req, res, next) => {
  res.render('menus', {
    title: 'Menus - Restaurante Saboroso',
    headerBackgroundImg: 'images/img_bg_1.jpg',
    headerTitle: 'Saboreie nosso menu!'
  })
})

router.get('/reservations', (req, res, next) => {
  res.render('reservations', {
    title: 'Reservas - Restaurante Saboroso',
    headerBackgroundImg: 'images/img_bg_2.jpg',
    headerTitle: 'Reserve uma mesa!'
  })
})

router.get('/services', (req, res, next) => {
  res.render('services', {
    title: 'Serviços - Restaurante Saboroso',
    headerBackgroundImg: 'images/img_bg_1.jpg',
    headerTitle: 'Um prazer poder servir!'
  })
})

module.exports = router;
