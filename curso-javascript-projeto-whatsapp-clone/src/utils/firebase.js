const firebase = require('firebase');
require('firebase/firestore')

export default class Firebase {
    constructor() {
        this._config = {
            apiKey: "AIzaSyAgvQ8Ur-nrF5CtJKcJYVfMdLYwLTQmdK8",
            authDomain: "whatsappclone-d2610.firebaseapp.com",
            databaseURL: "https://whatsappclone-d2610.firebaseio.com",
            projectId: "whatsappclone-d2610",
            storageBucket: "gs://whatsappclone-d2610.appspot.com",
            messagingSenderId: "479402346414",
            appId: "1:479402346414:web:79907550785b6658ce6a3f",
            measurementId: "G-JTCQL6ND8L"
          }

        this.init()
    }

    init() {
        if(!window._initializedFirebase) {
            window._initializedFirebase = true

            firebase.initializeApp(this._config)

            firebase.firestore().settings({})
        }
    }

    static db() {   
        return firebase.firestore()
    }

    static hd() {
        return firebase.storage()
    }

    initAuth() {
        return new Promise((resolve, reject) => {
            let provider = new firebase.auth.GoogleAuthProvider()

            firebase.auth().signInWithPopup(provider)
                .then(result => {
                    let token = result.credential.accessToken
                    let user = result.user

                    resolve({
                        user,
                        token
                    })
                })
                .catch(err => {
                    console.log(err)
                }) 
        })
    }
}