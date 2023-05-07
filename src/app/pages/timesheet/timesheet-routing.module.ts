import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageStates } from 'src/app/util';
import { TimesheetsComponent } from './timesheets/timesheets.component';
import { CreateTimesheetComponent } from './create-timesheet/create-timesheet.component';
import { TimesheetDetailsComponent } from './timesheet-details/timesheet-details.component';
import { canDeactivateForm } from 'src/app/guards/form.guard';

const routes: Routes = [
  {
    path: '',
    component: TimesheetsComponent,
    children: [
      {
        path: PageStates.Create,
        component: CreateTimesheetComponent,
        canDeactivate: [canDeactivateForm],
      },
      {
        path: PageStates.Details,
        component: TimesheetDetailsComponent,
        canDeactivate: [canDeactivateForm],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimesheetRoutingModule {}
