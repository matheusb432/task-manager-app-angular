import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DateSlide } from 'src/app/models';
import { DatesCarouselService, ModalService } from 'src/app/services';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss']
})
export class TimesheetsComponent implements OnInit {
  slides$: Observable<DateSlide[]> = of([]);

  constructor(
    private modalService: ModalService,
    private datesCarouselService: DatesCarouselService
  ) {}

  ngOnInit(): void {
    this.slides$ = this.datesCarouselService.getSlides();
  }
}
