import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared';
import { CreateTimesheetComponent } from './create-timesheet/create-timesheet.component';
import { TimesheetDetailsComponent } from './timesheet-details/timesheet-details.component';
import { TimesheetRoutingModule } from './timesheet-routing.module';
import { TimesheetsComponent } from './timesheets/timesheets.component';
import {
  MonthSlideComponent,
  TimesheetCarouselComponent,
  TimesheetFormComponent,
  TimesheetListComponent,
  TimesheetSlideComponent,
} from 'src/app/components/timesheet';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CrudPageModule } from 'src/app/shared/crud-page.module';
import { IconComponent } from 'src/app/components/custom/icon/icon.component';

@NgModule({
  declarations: [
    TimesheetsComponent,
    CreateTimesheetComponent,
    TimesheetDetailsComponent,
    MonthSlideComponent,
    TimesheetCarouselComponent,
    TimesheetListComponent,
    TimesheetFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CrudPageModule,
    TimesheetRoutingModule,
    CarouselModule,
    IconComponent,
    TimesheetSlideComponent,
  ],
})
export class TimesheetModule {}
