import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LotteryComponent } from './lottery.component';

@NgModule({
  declarations: [LotteryComponent],
  imports: [CommonModule, FormsModule],
})
export class LotteryModule {}
