import { ChangeDetectionStrategy, Component, Input, SimpleChanges } from '@angular/core';
import { MonthSlide } from 'src/app/models';

@Component({
  selector: 'app-month-slide [slide]',
  templateUrl: './month-slide.component.html',
  styleUrls: ['./month-slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthSlideComponent {
  @Input() slide!: MonthSlide;

  // TODO remove
  ngOnChanges(changes: SimpleChanges): void {
    console.warn('changes in month slide!');
    console.warn(changes);
  }

  // TODO remove any checkRenders
  checkRender(): boolean {
    console.log('checkRender monthSlide');
    return true;
  }
}
