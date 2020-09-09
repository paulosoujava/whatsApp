import config from './../../config'

var firebase = require('firebase/app')
require('firebase/auth')
require('firebase/firestore')
require('firebase/analytics')

export class Firebase {
    constructor() {
        this._firebaseConfig = {
            apiKey: config.apiKey,
            authDomain: config.authDomain,
            databaseURL: config.databaseURL,
            projectId: config.projectId,
            storageBucket: config.storageBucket,
            messagingSenderId: config.messagingSenderId,
            appId:config.appId,
            measurementId: config.measurementId
        }
        this.init()
    }

    init() {
        if (!window._initializedFirebase) {
            // Initialize Firebase
            firebase.initializeApp(this._firebaseConfig);
            firebase.analytics(); 
            window._initializedFirebase = true
        }
    }

    static db(){
        return firebase.firestore()
    }
    static hd(){
        return firebase.storage()
    }
    initAuth(){
        return new Promise((resolve, reject) => {
            let provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().signInWithPopup(provider)
            .then((result => {
                let token = result.credential.accessToken
                let user = result.user
                resolve({user, token})
            }))
            .catch( err => reject(err))
        })
    }
}