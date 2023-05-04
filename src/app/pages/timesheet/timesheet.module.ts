import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageModule } from 'src/app/shared';
import { CreateTimesheetComponent } from './create-timesheet/create-timesheet.component';
import { TimesheetDetailsComponent } from './timesheet-details/timesheet-details.component';
import { TimesheetRoutingModule } from './timesheet-routing.module';
import { TimesheetsComponent } from './timesheets/timesheets.component';
import { MonthSlideComponent, TimesheetCarouselComponent, TimesheetSlideComponent } from 'src/app/components/timesheet';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [
    TimesheetsComponent,
    CreateTimesheetComponent,
    TimesheetDetailsComponent,
    MonthSlideComponent,
    TimesheetSlideComponent,
    TimesheetCarouselComponent,
  ],
  imports: [CommonModule, PageModule, TimesheetRoutingModule, CarouselModule],
})
export class TimesheetModule {}
