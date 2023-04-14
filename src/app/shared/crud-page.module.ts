import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';

import { InputComponent } from '../components/custom/inputs/input/input.component';
import { SelectComponent } from '../components/custom/inputs/select/select.component';

@NgModule({
  declarations: [InputComponent, SelectComponent],
  imports: [CommonModule, NgOptimizedImage],
  exports: [InputComponent, SelectComponent],
})
export class CrudPageModule {}
