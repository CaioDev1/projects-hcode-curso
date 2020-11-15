class HcodeFileReader {
    constructor(inputEl, imgEl) {
        this._inputEl = inputEl
        this._imgEl = imgEl

        this.initInputEvent()
    }

    initInputEvent() {
        document.querySelector(this._inputEl).addEventListener('change', e => {
            this.reader(e.target.files[0]).then(img => {
                document.querySelector(this._imgEl).src = img
            })
        })
    }

    reader(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader()

            reader.onload = () => {
                resolve(reader.result)
            }

            reader.onerror = () => {
                reject('Não foi possível ler a imagem')
            }

            reader.readAsDataURL(file)
        })
    }
}