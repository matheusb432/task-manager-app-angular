import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';

import { InputComponent } from '../components/custom/inputs/input/input.component';
import { SelectComponent } from '../components/custom/inputs/select/select.component';
import { PageModule } from './page.module';

@NgModule({
  declarations: [InputComponent, SelectComponent],
  imports: [CommonModule, PageModule, NgOptimizedImage],
  exports: [InputComponent, SelectComponent],
})
export class CrudPageModule {}
