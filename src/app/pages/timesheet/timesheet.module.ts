import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageModule } from 'src/app/shared';
import { CreateTimesheetComponent } from './create-timesheet/create-timesheet.component';
import { TimesheetDetailsComponent } from './timesheet-details/timesheet-details.component';
import { TimesheetRoutingModule } from './timesheet-routing.module';
import { TimesheetsComponent } from './timesheets/timesheets.component';

@NgModule({
  declarations: [TimesheetsComponent, CreateTimesheetComponent, TimesheetDetailsComponent],
  imports: [CommonModule, PageModule, TimesheetRoutingModule],
})
export class TimesheetModule {}
