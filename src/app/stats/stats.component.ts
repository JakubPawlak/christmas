import { UserService } from './../services/user.service';
import { ListService, User } from './../services/list.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent {
  users;
  adminForm: FormGroup;
  environment = environment;

  constructor(public listService: ListService, private _user: UserService) {
    this.users = this.listService.getUsers();
    this.adminForm = new FormGroup({
      user: new FormControl('', [
        Validators.required,
        Validators.pattern('^admin$'),
      ]),
    });
  }

  get usersThatDrawnCount(): number {
    const users = this.listService.getUsers();
    return Array.from(users.keys()).filter((userName: string) => {
      if (users.get(userName)) {
        const obj = users.get(userName);
        return obj?.draw.length;
      }
      return false;
    }).length;
  }

  get usersThatAreNotDrawnCount(): number {
    return (
      Array.from(this.listService.getUsers().values()).filter(
        (user: User) => !user.isDrawn
      ).length || 0
    );
  }

  duplicates() {
    const users = this.listService.getUsers();
    const draws = Array.from(users.values())
      .map((user) => user.draw)
      .filter((draw) => !!draw.length);
    return this.find_duplicate_in_array(draws).length;
  }

  find_duplicate_in_array(arra1: string[]) {
    const object: Record<string, number> = {};
    const result = [];

    arra1.forEach((item) => {
      if (!object[item]) {
        object[item] = 0;
      }
      object[item] += 1;
    });

    for (const prop in object) {
      if (object[prop] >= 2) {
        result.push(prop);
      }
    }

    return result;
  }

  resetFirestore() {
    this._user.initFirestore();
  }

  purgeFirestore() {
    this._user.purgeFirestore();
  }
}
