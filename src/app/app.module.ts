import { LotteryModule } from './lottery/lottery.module';
import { StatsModule } from './stats/stats.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ListService } from './services/list.service';
import { UserService } from './services/user.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    LotteryModule,
    StatsModule,
  ],
  providers: [ListService, UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
