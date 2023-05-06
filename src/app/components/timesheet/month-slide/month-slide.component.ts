import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MonthSlide } from 'src/app/models';

@Component({
  selector: 'app-month-slide [slide]',
  templateUrl: './month-slide.component.html',
  styleUrls: ['./month-slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthSlideComponent {
  @Input() slide!: MonthSlide;
}
