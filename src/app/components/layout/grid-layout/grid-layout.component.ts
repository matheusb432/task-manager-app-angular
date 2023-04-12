import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
})
export class GridLayoutComponent {
  @Input() cols = '2';
  @Input() rowHeight = '2:1';
}
