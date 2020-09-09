import { Firebase } from '../util/Firebase'
import { Model } from './Model'

export class User extends Model {

    constructor(email) {
        super()
        if (email) {
            this.getById(email)
        }
    }
    getById(email) {
        return new Promise((resolve, reject) => {
            User.findByEmail(email).onSnapshot(doc => {
                this.fromJSON(doc.data())
                resolve(doc)
            })
            // User.findByEmail(email).get().then(doc => {
            //     this.fromJSON(doc.data())
            //     resolve(doc)
            // }).catch( err => {
            //     reject(err)
            // })
        })
    }
    save() {
        return User.findByEmail(this.email).set(this.toJSON())
    }
    static getRef() {
        return Firebase.db().collection('/users')
    }
    static findByEmail(email) {
        return User.getRef().doc(email)
    }

    addContact(contact) {
        return User.getRef()
            .doc(this.email)
            .collection('contacts')
            .doc(btoa(contact.email)) // convert em base64 padrao ascii
            .set(contact.toJSON())
    }

    get name() { return this._data.name }
    set name(name) { return this._data.name = name }

    get email() { return this._data.email }
    set email(email) { return this._data.email = email }

    get photo() { return this._data.photo }
    set photo(photo) { return this._data.photo = photo }
}