import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MonthSlide } from 'src/app/models';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-month-slide [slide]',
    templateUrl: './month-slide.component.html',
    styleUrls: ['./month-slide.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass]
})
export class MonthSlideComponent {
  @Input() slide!: MonthSlide;

  @Output() selectedSlide = new EventEmitter<MonthSlide>();

  onSlideClick(): void {
    this.selectedSlide.emit(this.slide);
  }
}
