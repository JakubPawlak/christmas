import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface User {
  draw: string;
  isDrawn: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ListService {
  users: Map<string, User> = new Map<string, any>();

  constructor(private _db: AngularFirestore) {
    this._db
      .collection('users')
      .snapshotChanges()
      .subscribe(
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.users.set(doc.payload.doc.id, <User>doc.payload.doc.data());
          });
        },
        (err) => console.warn(err)
      );
  }

  getUsers() {
    return this.users;
  }

  hasDraw(name: string): boolean {
    return !!this.users.get(name.toLowerCase())?.draw;
  }

  isDrawn(name: string): boolean {
    return !!this.users.get(name.toLowerCase())?.isDrawn;
  }

  userExist(name: string): boolean {
    return this.users.has(name.toLowerCase());
  }

  getAvailableUsers(userName: string): string[] {
    return Array.from(this.users.entries())
      .filter((user) => user[0] !== userName.toLowerCase())
      .filter((user) => !user[1].isDrawn)
      .map((user) => user[0]);
  }

  updateUser(name: string, draw: string): void {
    const user = this.users.get(name.toLowerCase());
    if (!user) {
      throw new Error('No user with name ' + name + 'found');
    }
    user.draw = draw.toLowerCase();
    console.dir(user);
    this._db.collection('users').doc(name.toLowerCase()).set(user);

    const d = this.users.get(draw.toLowerCase());
    if (!d) {
      throw new Error('No draw with name ' + name + 'found');
    }
    d.isDrawn = true;
    this._db.collection('users').doc(draw.toLowerCase()).set(d);
  }

  drawUser(): string {
    return '';
  }
}
