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
    }
}