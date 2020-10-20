class UserController {
    constructor(formCreateId, formUpdateId, tableId) {
        this.formEl = document.getElementById(formCreateId)
        this.formUpdateEl = document.getElementById(formUpdateId)
        this.tableEl = document.getElementById(tableId)

        this.onSubmit()
        this.onEdit()
        this.selectAll()
    }

    onEdit() {
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', e => {
            this.showPanel(true, false)
        })

        this.formUpdateEl.addEventListener('submit', e => {
            e.preventDefault()

            let btn = this.formEl.querySelector('[type=submit]')

            btn.disabled = true

            let values = this.getValues(this.formUpdateEl)

            let index = this.formUpdateEl.dataset.trIndex

            let tr = this.tableEl.rows[index]

            let oldUser = JSON.parse(tr.dataset.user)

            let result = Object.assign({}, oldUser, values)

            this.getPhoto(this.formUpdateEl).then(content => {
                if(!values.photo) {
                    result._photo = oldUser._photo
                } else {
                    result._photo = content
                }

                let user = new User()

                user.loadFromJSON(result)

                user.save()

                this.getTr(user, tr)

                this.updateCount()
    
                btn.disabled = false    
    
                this.formUpdateEl.reset()

                this.showPanel(true, false)
            })
        })
    }

    onSubmit() {
        this.formEl.addEventListener('submit', e => {
            e.preventDefault()

            let btn = this.formEl.querySelector('[type=submit]')

            btn.disable = true
        
            let values = this.getValues(this.formEl)

            if(!values) return false
            
            this.getPhoto(this.formEl).then(content => {
                values.photo = content

                values.save()

                this.addLine(values) // o this ta referenciando o onsubmit, pq uma arrow function n tem this, se n referenciaria o callback do eventlistener

                this.formEl.reset()
                btn.disable = false
            })
            .catch(error => {
                console.log(error)
            })
        })
    }

    getPhoto(formEl) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader()
        
            let elements = [...formEl.elements].filter(item => {
                if(item.name == 'photo') {
                    return item
                }
            })
    
            let file = elements[0].files[0]

            file ? fileReader.readAsDataURL(file) : resolve('../baixados.jpg')
    
            fileReader.onload = () => {
                resolve(fileReader.result)
            }

            fileReader.onerror = error => {
                reject(error)
            }
        })   
    }

    getValues(formEl) {
        let user = {};
        let isValid = true;

        [...formEl.elements].forEach(field => {
            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
                field.parentElement.classList.add('has-error')
                isValid = false
            }

            if(field.name == 'gender' && field.checked) {
                user[field.name] = field.value
            } else if(field.name == 'admin') {
                user[field.name] = field.checked
            }
            else {
                user[field.name] = field.value
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
 
    selectAll() {
        let users = User.getUsersFromStorage()

        users.forEach(trData => {
             let user = new User()

            user.loadFromJSON(trData)

            this.addLine(user)
        })
    }

    addLine(dataUser) {
        let tr = this.getTr(dataUser)

        this.tableEl.appendChild(tr)

        this.updateCount()
    }

    getTr(dataUser, tr=null) {
        if(tr === null) {
            tr = document.createElement('tr')
        }

        tr.dataset.user = JSON.stringify(dataUser)

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin ? 'Sim' : 'Não'}</td>
            <td>${Utils.formatDate(dataUser.register)}</td>
            <td>
              <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
              <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `

        this.addEventsTr(tr)

        return tr
    }

    addEventsTr(tr) {
        tr.querySelector('.btn-delete').addEventListener('click', () => {
            if(confirm('Deseja realmente excluir?')) {
                let user = new User()

                user.loadFromJSON(JSON.parse(tr.dataset.user))

                user.remove()

                tr.remove()

                this.updateCount()
            }
        })
        tr.querySelector('.btn-edit').addEventListener('click', e => {
            let json = JSON.parse(tr.dataset.user)

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex

            for(let name in json) {
                let field = this.formUpdateEl.querySelector('[name=' + name.replace('_', '') + ']')

                if(field) {
                    switch(field.type) {
                        case 'file':
                            continue
                        case 'radio':
                            field = this.formUpdateEl.querySelector('[name=' + name.replace('_', '') + ']' + '[value='+ json[name] +']')
                            field.checked = true
                            break
                        case 'checkbox':
                            field.checked = json[name]
                            break
                        default:
                            field.value = json[name]
                    }
                }
            }

            this.formUpdateEl.querySelector('.photo').src = json._photo

            this.showPanel(false, true)
        })
    }

    showPanel(create, update) {
        document.querySelector('#box-user-create').style.display = create ? 'block' : 'none' 
        document.querySelector('#box-user-update').style.display = update ? 'block' : 'none' 
    }

    updateCount() {
        let numberUsers = 0
        let numberAdmins = 0;

        [...this.tableEl.children].forEach(tr => {
            numberUsers++

            let user = JSON.parse(tr.dataset.user)

            if(user._admin) {
                numberAdmins++
            }
        })

        document.querySelector('#number-users').innerHTML = numberUsers
        document.querySelector('#number-users-admin').innerHTML = numberAdmins
    }
}