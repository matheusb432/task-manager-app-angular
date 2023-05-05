import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InputComponent } from '../components/custom/inputs/input/input.component';
import { SelectComponent } from '../components/custom/inputs/select/select.component';
import { PageModule } from './page.module';
import { SearchComponent } from '../components/custom/inputs/search/search.component';

@NgModule({
  declarations: [InputComponent, SelectComponent, SearchComponent],
  imports: [CommonModule, PageModule],
  exports: [InputComponent, SelectComponent, SearchComponent],
})
export class CrudPageModule {}
