import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageStates } from 'src/app/util';
import { TimesheetsComponent } from './timesheets/timesheets.component';
import { CreateTimesheetComponent } from './create-timesheet/create-timesheet.component';
import { TimesheetDetailsComponent } from './timesheet-details/timesheet-details.component';

const routes: Routes = [
  { path: '', component: TimesheetsComponent },
  { path: PageStates.Create, component: CreateTimesheetComponent },
  { path: PageStates.Details, component: TimesheetDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimesheetRoutingModule {}
