import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LayoutComponent,
  ],
  exports: [ReactiveFormsModule, LayoutComponent],
  providers: [],
})
export class SharedModule {}
