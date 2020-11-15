let connection = require('./db')
const path = require('path')

module.exports = {
    getMenus() {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT * FROM tb_menus ORDER BY title
            `, (err, results) => {
              if(err) {
                reject(err)
              }
                resolve(results)
            })
        })
    },

    save(fields, files) {
        return new Promise((resolve, reject) => {
            fields.photo = `images/${path.parse(files.photo.path).base}`

            let query, queryPhoto, params = [
                fields.title,
                fields.description,
                fields.price,
            ]

            if(files.photo.name) {
                queryPhoto = ',photo = ?'

                params.push(fields.photo)
            }

            if(parseInt(fields.id) > 0) {
                params.push(fields.id)

                query = `
                    UPDATE tb_menus
                    SET title = ?,
                        description = ?,
                        price = ?
                        ${queryPhoto ? queryPhoto : ''}
                    WHERE id = ?
                `
            } else {
                if(!files.photo.name) reject('Envie a foto do prato')

                query = `
                    INSERT INTO tb_menus (title, description, price, photo)
                    VALUES (?, ?, ?, ?)
                `
            }

            connection.query(query, params, (err, results) => {
                if(err) {
                     console.log(results)
                    reject(err)
                } else {
                    resolve(results[0])
                }
            })
        })
    },

    delete(id) {
        return new Promise((resolve, reject) => {
            connection.query(`
                DELETE FROM tb_menus WHERE id = ?
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