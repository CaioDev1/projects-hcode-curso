class HcodeGrid {
    constructor(configs) {
        configs.listeners = Object.assign({
            afterClickEvent: (e) => {
                $('#modal-update').modal('show')
            },
            afterDeleteClick: (e) => {
                window.location.reload()
            },
            afterFormCreate: (e) => {
                window.location.reload()
            },
            afterFormUpdate: (e) => {
                window.location.reload()
            },
            afterFormCreateError: (e) => {
                alert('Não foi possível enviar o formulário')
            },
            afterFormUpdateError: (e) => {
                alert('Não foi possível enviar o formulário')
            }
        }, configs.listeners)

        this._options = Object.assign({}, {
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: 'btn-update',
            btnDelete: 'btn-delete',
            onUpdateLoad: (formUpdate, name, data) => {
                let input = formUpdate.querySelector(`[name=${name}]`)

                if(input) input.value = data[name]
            }
        }, configs)

        this.rows = [...document.querySelectorAll('table tbody tr')]

        this.initForms()    
        this.initButtons()
    }

    fireEvent(name, args) {
        if(typeof this._options.listeners[name] === 'function') {
            this._options.listeners[name].apply(this, args)
        }
    }

    initForms() {
        this.formCreate = document.querySelector(this._options.formCreate)

        if(this.formCreate) {
            this.formCreate.save({
                success: () => {
                    this.fireEvent('afterFormCreate')
                },
                failure: () => {
                    this.fireEvent('afterFormCreateError')
                }
            })
        }
      
        this.formUpdate = document.querySelector(this._options.formUpdate)
      
        if(this.formUpdate) {
            this.formUpdate.save({
                success: () => {
                    this.fireEvent('afterFormUpdate')
                },
                failure: () => {
                    this.fireEvent('afterFormUpdateError')
                }
            })
        }
    }

    getTrData(e) {
        let tr = e.path.find(el => {
            return (el.tagName.toUpperCase() === 'TR')
        })

        return JSON.parse(tr.dataset.row)
    }

    btnUpdateClick(e) {
        this.fireEvent('beforeClickEvent', [e])
            
        let data = this.getTrData(e)
  
        for(let name in data) {
          this._options.onUpdateLoad(this.formUpdate, name, data)
        }

        this.fireEvent('afterClickEvent', [e])
    }

    btnDeleteClick(e) {
        this.fireEvent('beforeDeleteClick')

        let data = this.getTrData(e)
    
        if(confirm(eval('`' + this._options.deleteMsg + '`'))) {
            fetch(eval('`' + this._options.deleteUrl + '`'), {
            method: 'DELETE'
            }).then(response => response.json())
            .then(res => {
                this.fireEvent('afterDeleteClick', [e])
            })
        }
    }

    initButtons() {
        this.rows.forEach(row => {
            [...row.querySelectorAll('.btn')].forEach(btn => {
                btn.addEventListener('click', e => {
                    if(e.target.classList.contains(this._options.btnUpdate)) {
                        this.btnUpdateClick(e)
                    } else if(e.target.classList.contains(this._options.btnDelete)) {
                        this.btnDeleteClick(e)
                    } else {
                        this.fireEvent('buttonClick', [e.target, this.getTrData(e), e])
                    }
                })
            })
        });
    }
}