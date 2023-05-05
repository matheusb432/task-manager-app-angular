import { DateSlide } from 'src/app/models';
import { Icons } from 'src/app/util';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-timesheet-slide [slide]',
  templateUrl: './timesheet-slide.component.html',
  styleUrls: ['./timesheet-slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetSlideComponent {
  @Input() slide!: DateSlide;

  @Output() selectedSlide = new EventEmitter<DateSlide>();

  Icons = Icons;

  // TODO remove
  ngOnChanges(): void {
    console.warn('changes in timesheet slide!');
  }

  onSlideClick(slide: DateSlide): void {
    this.selectedSlide.emit(slide);
  }

  // TODO remove any checkRenders
  checkRender(): boolean {
    console.log('checkRender slide');
    return true;
  }
}
