class calcController {
    constructor() {
        this._calc = []
        this.local = 'pt-BR'
        this._date = document.querySelector('#data')
        this._time = document.querySelector('#hora')
        this._display = document.querySelector('#display')
        this.initialize()
    }

    initialize() {
        this.setDisplayDateTime()

        setInterval(() => {
            this.setDisplayDateTime()
        }, 1000)

        this.addButtonEvents()
    }

    allClearButton() {
        this._calc = []

        this.displayLastNumber()
    }

    clearEntryButton() {
        this._calc.pop()

        this.displayLastNumber()
    }

    addMultipleEvents(element, events, f) {
        events.split(' ').map(event => {
            element.addEventListener(event, f, false)
        })
    }

    isOperator(value) {
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1)
    }

    changeLastValue(value) {
        this._calc[this._calc.length - 1] = value
    }

    displayLastNumber() {
        let lastNumber

        for(let i = this._calc.length - 1; i >= 0; i--) {
            if(this.isOperator(this._calc[i])) {
                lastNumber = this._calc[i]
                break
            }
        }

        if(!lastNumber) lastNumber = 0

        this.display = lastNumber
    }

    getLastValue() {
        return this._calc[this._calc.length - 1]
    }

    pushValue(value) {
        this._calc.push(value)

        if(this._calc.length > 3) {
            this.handleCalc()
        }
    }

    handleCalc() {
        
    }

    buttonAction(value) {
        if(isNaN(this.getLastValue())) {
            if(this.isOperator(value)) {
                this.changeLastValue(value)
            } else if(!isNaN(value)){
                this._calc.push(value)
                this.displayLastNumber()
            }
        } else {
            let newNumber = this._calc.join(' ').toString() + value.toString()
            this._calc = [parseInt(newNumber)]

            this.displayLastNumber()
        }

        console.log(this._calc)
    }

    buttonClicked(value) {
        switch(value) {
            case 'ac':
                this.allClearButton()
                break
            case 'ce':
                this.clearEntryButton()
                break
            case 'soma':
                this.buttonAction('+')
                break
            case 'subtracao':
                this.buttonAction('-')
                break
            case 'multiplicacao':
                this.buttonAction('*')
                break
            case 'divisao':
                this.buttonAction('/')
                break
            case 'porcento':
                this.buttonAction('%')
                break
            case 'igual':
                this.buttonAction('=')
                break
            case 'ponto':
                this.buttonAction('.')
                break

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.buttonAction(value)
                break

            default:
                this.displayError()
                break
        }
    }

    displayError() {
        this.display = 'Error'
    }

    addButtonEvents() {
        let buttons = document.querySelectorAll('#buttons > g, #parts > g')

        buttons.forEach(btn => {
            this.addMultipleEvents(btn, 'click drag', () => {
                this.buttonClicked(btn.className.baseVal.replace('btn-', ''))
            })

            this.addMultipleEvents(btn, 'mouseover mouseup', () => [
                btn.style.cursor = 'pointer'
            ])
        })
    }

    setDisplayDateTime() {
        this.date = this.currentDate.toLocaleDateString(this.local, {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })

        this.time = this.currentDate.toLocaleTimeString(this.local)
    }

    get display() {
        return this._display.innerHTML
    }

    set display(value) {
        this._display.innerHTML = value
    }

    get date() {
        return this._date.innerHTML
    }

    set date(value) {
        this._date.innerHTML = value
    }

    get time() {
        return this._time.innerHTML
    }

    set time(value) {
        this._time.innerHTML = value
    }

    get currentDate() {
        return new Date()
    }
}