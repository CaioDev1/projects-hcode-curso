import Firebase from './firebase'

export default class Upload {
    static send(file, date, from) {
        return new Promise((resolve, reject) => {
            let uploadTask = Firebase.hd().ref(from).child(date + '_' + file.name).put(file)

            uploadTask.on('state_changed', () => {}, err => {
                console.error(err)
                reject(err)
            }, () => {
                Firebase.hd().ref(from).child(date + '_' + file.name).getDownloadURL().then(url => {
                    resolve(url)
                })
            })  
        })
    } 
}