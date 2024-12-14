import { Injectable } from '@angular/core';
import { User } from './list.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _users = [

  ]; // fill with your lottery names. These names will be used to draw and to be drawn
  private _initialUser = {
    isDrawn: false,
    draw: '',
  };

  constructor(private _db: AngularFirestore) {}

  initFirestore() {
    this._users.forEach((userName) => {
      this._db.collection('users').doc(userName).set(this._initialUser);
    });
  }

  purgeFirestore() {
    this._db
      .collection('users')
      .snapshotChanges()
      .pipe(first())
      .subscribe(
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.payload.doc.id);
            this._db.collection('users').doc(doc.payload.doc.id).delete();
          });
        },
        (err) => console.warn(err)
      );
  }
}
