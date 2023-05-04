import { Component, Input } from '@angular/core';
import { MonthSlide } from 'src/app/models';

@Component({
  selector: 'app-month-slide [slide] [isNextMonth]',
  templateUrl: './month-slide.component.html',
  styleUrls: ['./month-slide.component.scss']
})
export class MonthSlideComponent  {
  @Input() slide!: MonthSlide;
  @Input() isNextMonth!: boolean;
}
