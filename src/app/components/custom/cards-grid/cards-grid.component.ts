import { Component, Input } from '@angular/core';
import { Card } from 'src/app/models';

@Component({
  selector: 'app-cards-grid [cards]',
  templateUrl: './cards-grid.component.html',
  styleUrls: ['./cards-grid.component.scss']
})
export class CardsGridComponent {
  @Input() cards!: Card[];


}
