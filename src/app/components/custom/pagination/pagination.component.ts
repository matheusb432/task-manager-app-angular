import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination [totalItems] [pageChanged]',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() totalItems!: number;
  @Input() itemsPerPage: 5 | 10 | 25 | 50 = 10;
  @Input() color: ThemePalette = 'primary';

  @Output() pageChanged = new EventEmitter<PageEvent>();
}
