import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from './shared.module';
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
import { IconComponent } from '../components/custom/icon/icon.component';
import { SlideComponent } from '../components/custom/inputs/slide/slide.component';

@NgModule({
  declarations: [InputComponent, SelectComponent, SearchComponent, FormArrayLayoutComponent],
  imports: [
    CommonModule,
    SharedModule,
    DatepickerComponent,
    DateRangePickerComponent,
    CheckboxComponent,
    TextareaComponent,
    SlideComponent,
    IconComponent,
  ],
  exports: [
    InputComponent,
    SelectComponent,
    SearchComponent,
    DatepickerComponent,
    DateRangePickerComponent,
    CheckboxComponent,
    TextareaComponent,
    SlideComponent,
    FormArrayLayoutComponent,
  ],
})
export class CrudPageModule {}
