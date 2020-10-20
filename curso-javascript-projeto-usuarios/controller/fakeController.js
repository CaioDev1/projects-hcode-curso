class UserController {
    constructor(form, updateForm, table) {
        this._formEl = document.getElementById(form)
        this._tableEl = document.getElementById(table)
        this.formUpdateEl = document.getElementById(updateForm)

        this.onSubmit()
        this.onEdit()
        this.loadUsers()
    }

    onEdit() {
        document.querySelector('.btn-cancel').addEventListener('click', () => {
            this.updateCurrentForm(true, false)
        })

        this.formUpdateEl.addEventListener('submit', e => {
            e.preventDefault()

            let btn = document.querySelector('[type=submit]')

            btn.disabled = true

            let editedUserData = this.getValues(this.formUpdateEl)

            let index = this.formUpdateEl.dataset.trIndex

            let tr = this._tableEl.rows[index]

            let oldUserData = JSON.parse(tr.dataset.user)

            let result = Object.assign({}, oldUserData, editedUserData)

            this.getPhoto(this.formUpdateEl).then(content => {
                if(!editedUserData.photo) {
                    result._photo = oldUserData._photo
                } else {
                    result._photo = content
                }

                let user = new User()

                user.save(result)

                this.addUserOnTable(result, tr)

                this.formUpdateEl.reset()
            
                this.updateUsersCounter()

                btn.disabled = false

                this.updateCurrentForm(true, false)        
            }).catch(err => console.log(err))
        })
    }

    onSubmit() {
        this._formEl.addEventListener('submit', e => {
            e.preventDefault()

            let btn = document.querySelector('[type=submit]')
            btn.disabled = true

            let newUser = this.getValues(this._formEl)

            if(!newUser) {
                btn.disabled = false
                return false
            }

            this.getPhoto(this._formEl).then(content => {
                newUser.photo = content

                let user = new User()

                user.save(newUser)

                this.addUserOnTable(newUser)

                this._formEl.reset()

                btn.disabled = false
            }).catch(error => {
                console.log(error)
            })
        })
    }

    getPhoto(form) {
        return new Promise((resolve, rejeict) => {
            let photo = [...form.elements].filter(item => {
                if(item.type == 'file') {
                    return item
                }
            })
    
            let file = photo[0].files[0]
            
            let reader = new FileReader()
    
            file ? reader.readAsDataURL(file) : resolve('../baixados.jpg')

            reader.onload = () => {
                resolve(reader.result)
            }

            reader.onerror = error => {
                rejeict(error)
            }
        })
    }

    getValues(form) {
        let user = {};
        let isValid = true;

        [...form.elements].forEach(item => {
            if(['name', 'password', 'email'].includes(item.name) && !item.value) {
                item.parentElement.classList.add('has-error')
                isValid = false
            }

            if(item.name == 'gender') {
                if(item.checked) {
                    user[item.name] = item.value
                }
            } else if(item.name == 'admin') {
                user[item.name] = item.checked
            } else {
                user[item.name] = item.value
            }
        })

        if(isValid) {
            return new User(
                user.name,
                user.gender,
                user.birth,
                user.country,
                user.email,
                user.password,
                user.photo,
                user.admin
            )
        } else {
            return false
        }
    }

    loadUsers() {
        let users = User.getLastUsers()

        users.map(userData => {
            this.addUserOnTable(userData)
        })
    }

    addUserOnTable(userData, tr=null) {
        if(tr == null) {
            tr = document.createElement('tr')
        }

        tr.dataset.user = JSON.stringify(userData)

        tr.innerHTML = `
            <td><img src="${userData._photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${userData._name}</td>
            <td>${userData._email}</td>
            <td>${userData._admin ? 'Sim' : 'Não'}</td>
            <td>${Utils.formatDate(userData._register)}</td>
            <td>
              <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
              <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `

        this.addTrEvents(tr)

        this._tableEl.appendChild(tr)

        this.updateUsersCounter()
    }

    addTrEvents(tr) {
        tr.querySelector('.btn-delete').addEventListener('click', () => {
            if(confirm('Tem certeza que deseja excluir?')) {
                let user = new User()

                user.removeUser(JSON.parse(tr.dataset.user))

                tr.remove()

                this.updateUsersCounter()
            }
        })

        tr.querySelector('.btn-edit').addEventListener('click', () => {
            let json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex

            for(let name in json) {
                if(name !== '_register') {
                    let element = this.formUpdateEl.querySelector('[name=' + name.replace('_', '') + ']')

                    if(name) {
                        switch(element.type) {
                            case 'file':
                                continue
                            case 'radio':
                                let radio = this.formUpdateEl.querySelector('[name=' + name.replace('_', '') + '][value=' + json[name] + '] ')
                                radio.checked = true
                                break
                            case 'checkbox':
                                element.checked = json[name]
                                break
                            default:
                                element.value = json[name]
                        }
                    }
                }
            }

            this.formUpdateEl.querySelector('.photo').src = json._photo

            this.updateCurrentForm(false, true)
        })
    }

    updateCurrentForm(create, update) {
        document.querySelector('#box-user-create').style.display = create ? 'block' : 'none'
        document.querySelector('#box-user-update').style.display = update ? 'block' : 'none'
    }

    updateUsersCounter() {
        let userNumber = 0
        let adminNumber = 0;

        [...this._tableEl.children].forEach(item => {
            userNumber++

            let user = JSON.parse(item.dataset.user)

            user._admin && adminNumber++
        })

        document.querySelector('#number-users').innerHTML = userNumber
        document.querySelector('#number-users-admin').innerHTML = adminNumber
    }
}