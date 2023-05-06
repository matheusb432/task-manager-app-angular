import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Card } from 'src/app/models';

@Component({
  selector: 'app-cards-grid [cards]',
  templateUrl: './cards-grid.component.html',
  styleUrls: ['./cards-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsGridComponent {
  @Input() cards!: Card[];
}
