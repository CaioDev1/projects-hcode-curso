const connection = require('./db')

module.exports = {
    render(req, res, error, success) {
        res.render('reservations', {
            title: 'Reservas - Restaurante Saboroso',
            headerBackgroundImg: 'images/img_bg_2.jpg',
            headerTitle: 'Reserve uma mesa!',
            body: req.body,
            error,
            success 
        })
    },

    save(fields) {
        return new Promise((resolve, reject) => {
            if(fields.date.indexOf('/') > -1) {
                let date = fields.date.split('/')
                fields.date = `${date[2]}-${date[1]}-${date[0]}`
            }

            let query, params = [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
            ]

            if(parseInt(fields.id) > 0) {
                params.push(fields.id)

                query = `
                    UPDATE tb_reservations
                    SET name = ?,
                        email = ?,
                        people = ?,
                        date = ?,
                        time = ?
                    WHERE id = ?
                `
            } else {
                query = `
                    INSERT INTO tb_reservations (name, email, people, date, time)
                    VALUES (?, ?, ?, ?, ?)
                `
            }
            
            connection.query(query, params, (err, results) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    },

    getReservations() {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT * FROM tb_reservations ORDER BY date DESC
            `, (err, results) => {
              if(err) {
                reject(err)
              }
                resolve(results)
            })
        })
    },

    delete(id) {
        return new Promise((resolve, reject) => {
            connection.query(`
                DELETE FROM tb_reservations WHERE id = ?
            `, [
                id
            ], (err, results) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }
}