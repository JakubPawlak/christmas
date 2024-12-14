import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsComponent } from './stats.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [StatsComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class StatsModule {}
