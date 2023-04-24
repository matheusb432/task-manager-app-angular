import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { Constants } from 'src/app/utils';

@Component({
  selector: 'app-pagination [totalItems] [pageChanged]',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() totalItems!: number;
  @Input() itemsPerPage: 5 | 10 | 25 | 50 = Constants.DefaultItemsPerPage;
  @Input() color: ThemePalette = 'primary';
  @Input() currentPage = 1;

  @Output() pageChanged = new EventEmitter<PageEvent>();
}
