import { UserService } from './../services/user.service';
import { ListService } from './../services/list.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.scss'],
})
export class LotteryComponent {
  title = 'christmas';
  userName = '';
  items: any;
  message = '';
  drawn = '';
  isLoaded = false;

  constructor(private _listService: ListService, private _user: UserService) {}

  submit() {
    const userName = this.userName.toLowerCase();
    this.drawn = '';
    this.isLoaded = false;
    if (this._listService.userExist(userName)) {
      if (this._listService.hasDraw(userName)) {
        this.message = 'Masz już swój los';
        alert(this.message);
      } else {
        const availableUsers = this._listService.getAvailableUsers(userName);
        // console.dir(availableUsers);
        if (availableUsers.length === 2) {
          const firstHasDraw = this._listService.hasDraw(availableUsers[0]);
          const secondHasDraw = this._listService.hasDraw(availableUsers[1]);
          if (firstHasDraw && secondHasDraw) {
            this.drawUser(availableUsers);
          } else {
            let drawn;
            firstHasDraw
              ? (drawn = availableUsers[1])
              : (drawn = availableUsers[0]);
            this.drawn = drawn;
            this._listService.updateUser(userName, drawn);
            this.delayLoaded();
          }
        } else {
          this.drawUser(availableUsers);
        }
      }
    } else {
      this.message =
        'Nie ma takiej osoby na liście. Sprawdź poprawność wpisanego imienia. Polskie litery mają znaczenie.';
      alert(this.message);
    }
  }

  // drawParticularUser(user: string) {
  //     this.drawn = user.toLocaleLowerCase();
  //     this._listService.updateUser(this.userName.toLowerCase(), this.drawn);
  //     this.delayLoaded();
  // }

  drawUser(availableUsers: string[]) {
    const random = this.getRandomNumber(availableUsers.length);
    // console.log('random number', random);
    this.drawn = availableUsers[random];
    // console.log('drawn user', this.drawn);
    this._listService.updateUser(this.userName.toLowerCase(), this.drawn);
    this.delayLoaded();
  }

  duplicates() {
    const users = this._listService.getUsers();
    // console.dir(users);
    const draws = Array.from(users.values()).map((user) => user.draw);
    // console.log(this.find_duplicate_in_array(draws));
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

  delayLoaded() {
    // console.log('delay loaded');
    setTimeout(() => {
      this.isLoaded = true;
      // console.log('loaded is true');
    }, 1000);
  }

  getRandomNumber(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
