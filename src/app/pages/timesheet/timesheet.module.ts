import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimesheetsComponent } from './timesheets/timesheets.component';
import { CreateTimesheetComponent } from './create-timesheet/create-timesheet.component';
import { TimesheetDetailsComponent } from './timesheet-details/timesheet-details.component';
import { PageModule } from 'src/app/shared';
import { RouterModule } from '@angular/router';
import { TimesheetRoutingModule } from './timesheet-routing.module';



@NgModule({
  declarations: [
    TimesheetsComponent,
    CreateTimesheetComponent,
    TimesheetDetailsComponent
  ],
  imports: [
    CommonModule,
    PageModule,
    TimesheetRoutingModule,
  ]
})
export class TimesheetModule { }
