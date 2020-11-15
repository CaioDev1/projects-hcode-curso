const connection = require('./db')

module.exports = {
    render(req, res, error) {
        res.render('admin/login', {
            body: req.body,
            error: error
        })
    },

    login(email, password) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT * FROM tb_users WHERE email = ?
            `, [
                email
            ], (err, results) => {
                if(err) {
                    reject(err)
                } else {
                    let row = results[0]

                    if(results.length == 0 || row.password !== password) {
                        reject('Usuário ou senha incorretos')
                    } else {
                        resolve(row)
                    }
                }
            })
        })
    },

    getUsers() {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT * FROM tb_users ORDER BY name
            `, (err, results) => {
              if(err) {
                reject(err)
              }
                resolve(results)
            })
        })
    },

    save(fields) {
        return new Promise((resolve, reject) => {

            let query, params = [
                fields.name,
                fields.email,   
            ]

            if(parseInt(fields.id) > 0) {
                params.push(fields.id)

                query = `
                    UPDATE tb_users
                    SET name = ?,
                        email = ?
                    WHERE id = ?
                `
            } else {
                params.push(fields.password)

                query = `
                    INSERT INTO tb_users (name, email, password)
                    VALUES (?, ?, ?)
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
                DELETE FROM tb_users WHERE id = ?
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
    },

    changePassword(req) {
        return new Promise((resolve, reject) => {
            if(!req.fields.password) {
                reject('Preencha a senha.')
            } else if(req.fields.password !== req.fields.passwordConfirm) {
                reject('Confirme a senha corretamente.')
            } else {
                connection.query(`
                    UPDATE tb_users
                    SET password = ?
                    WHERE id = ?
                `, [
                    req.fields.password,
                    req.fields.id
                ], (err, results) => {
                    if(err) {
                        reject(err.message)
                    } else {
                        resolve(results)
                    }
                })
            }
        })
    }
}