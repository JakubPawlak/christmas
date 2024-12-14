import { Component } from '@angular/core';
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="isNotProduction" style="position: absolute; z-index: 1; background-color: red; left: 0; right: 0; padding: 8px">This is not production
    </div>
    <router-outlet></router-outlet> `,
})
export class AppComponent {
  protected readonly isNotProduction = !environment.production;
}
