import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DateSlide } from 'src/app/models';
import { DatesCarouselService, TimesheetService } from 'src/app/services';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetsComponent implements OnInit {
  slides$: Observable<DateSlide[]> = of([]);

  get listItems() {
    return this.service.listItems;
  }

  get total() {
    return this.service.total;
  }

  constructor(
    private service: TimesheetService,
    private datesCarouselService: DatesCarouselService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.slides$ = this.datesCarouselService.getSlides();
    this.service.loadListData();
  }

  ngOnChanges(): void {
    console.warn(`timesheets changes!`);
  }

  checkRender(): boolean {
    console.log('checkRender timesheets');
    return true;
  }

}
