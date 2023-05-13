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
import { TextareaComponent } from '../components/custom/inputs/textarea/textarea.component';
import { FormArrayLayoutComponent } from '../components/layout/form-array-layout/form-array-layout.component';
import { DateRangePickerComponent } from '../components/custom/inputs/date-range-picker/date-range-picker.component';

@NgModule({
  declarations: [InputComponent, SelectComponent, SearchComponent, FormArrayLayoutComponent],
  imports: [
    CommonModule,
    PageModule,
    DatepickerComponent,
    DateRangePickerComponent,
    CheckboxComponent,
    TextareaComponent,
  ],
  exports: [
    InputComponent,
    SelectComponent,
    SearchComponent,
    DatepickerComponent,
    DateRangePickerComponent,
    CheckboxComponent,
    TextareaComponent,
    FormArrayLayoutComponent,
  ],
})
export class CrudPageModule {}
