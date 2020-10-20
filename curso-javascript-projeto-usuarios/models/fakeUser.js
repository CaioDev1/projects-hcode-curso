class User {
    constructor(name, gender, birth, country, email, password, photo, admin) {
        this._name = name
        this._gender = gender
        this._birth = birth
        this._country = country
        this._email = email
        this._password = password
        this._photo = photo
        this._admin = admin
        this._register = new Date()
    }

    get name() {
        return this._name
    }

    get gender() {
        return this._gender
    }

    get birth() {
        return this._birth
    }

    get country() {
        return this._country
    }

    get email() {
        return this._email
    }

    get password() {
        return this._password
    }

    get photo() {
        return this._photo
    }

    get admin() {
        return this._admin
    }

    get register() {
        return this._register
    }

    set photo(value) {
        this._photo = value
    }

    static getLastUsers() {
        let usersList = []
        
        if(localStorage.getItem('users')) {
            usersList = JSON.parse(localStorage.getItem('users'))
        }

        return usersList
    }

    save(userData) {
        let users = User.getLastUsers()

        users.push(userData)

        localStorage.setItem('users', JSON.stringify(users))
    }

    removeUser(userData) {
        let users = User.getLastUsers()

        users.map((user, index) => {
            if(user._email == userData._email) {
                users.splice(index, 1)
            }
        })

        localStorage.setItem('users', JSON.stringify(users))
    }
}