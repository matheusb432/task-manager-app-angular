import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-layout',
  templateUrl: './card-layout.component.html',
  styleUrls: ['./card-layout.component.scss'],
})
export class CardLayoutComponent {
  @Input() imageUrl = '/assets/img/placeholder.png';
  @Input() imageAlt = '';
}
