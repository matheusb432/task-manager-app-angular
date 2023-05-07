import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PageModule } from './page.module';
import {
  CheckboxComponent,
  DatepickerComponent,
  InputComponent,
  SearchComponent,
  SelectComponent,
} from '../components/custom/inputs';

@NgModule({
  declarations: [InputComponent, SelectComponent, SearchComponent, CheckboxComponent],
  imports: [CommonModule, PageModule, DatepickerComponent],
  exports: [
    InputComponent,
    SelectComponent,
    SearchComponent,
    DatepickerComponent,
    CheckboxComponent,
  ],
})
export class CrudPageModule {}
