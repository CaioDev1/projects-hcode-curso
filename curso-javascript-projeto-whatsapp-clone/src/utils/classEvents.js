export default class ClassEvents {
    constructor() {
        this._events = {}
    }

    on(eventName, fn) {
        if(!this._events[eventName]) this._events[eventName] = []

        this._events[eventName].push(fn)
    }

    trigger() {
        let args = [...arguments]
        let eventName = args.shift()

        args.push(new Event(eventName))

        if(this._events[eventName] instanceof Array) { // se this._events[eventName] é um array
            this._events[eventName].forEach(fn => {
                fn.apply(null, args) // apply() força o código a ser executado
            })
        }
    }
}