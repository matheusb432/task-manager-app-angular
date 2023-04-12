import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/models/configs';

@Component({
  selector: 'app-cards-grid',
  templateUrl: './cards-grid.component.html',
  styleUrls: ['./cards-grid.component.scss']
})
export class CardsGridComponent implements OnInit {
  // TODO remove
  cards: Card[] = [
    {
      title: 'Card 1',
      content: 'This is the first card',
    },
    {
      title: 'Card 2',
      content: 'This is the second card',
    },
    {
      title: 'Card 3',
      content: 'This is the third card',
    },
  ];
  constructor() { }

  ngOnInit() {
  }

}
