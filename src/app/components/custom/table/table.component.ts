import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { InvalidTableConfigError } from 'src/app/helpers/errors';
import { IconConfig } from 'src/app/models/configs';
import { TableItem } from 'src/app/models/types';
import { Icons } from 'src/app/utils';

@Component({
  selector: 'app-table [items] [tableHeaders] [tableKeys]',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T extends TableItem> implements OnInit, OnChanges {
  @Input() items!: T[];
  @Input() tableHeaders!: string[];
  @Input() tableKeys!: (keyof T)[];
  // @Input() tableHeaders!: () => string[];

  // @Input() tableKeys!: () => (keyof T)[];

  // @Input() copyItem?: (id: number) => void;
  // @Input() viewItem?: (id: number) => void;
  // @Input() editItem?: (id: number) => void;
  // @Input() deleteItem?: (id: number) => void;
  @Output() copyItem = new EventEmitter<number>();
  @Output() viewItem = new EventEmitter<number>();
  @Output() editItem = new EventEmitter<number>();
  @Output() deleteItem = new EventEmitter<number>();

  icons: IconConfig<number>[] = [];

  ngOnInit(): void {
    this.initIcons();
  }

  ngOnChanges(): void {
    if (this.tableHeaders != null && this.tableKeys != null) this.validateList();
  }

  initIcons(): void {
    this.icons = [
      // TODO links as [routerLink] on icon?
      new IconConfig(Icons.ContentCopy, (id: number) => this.copyItem.emit(id)),
      new IconConfig(Icons.Edit, (id: number) => this.editItem.emit(id)),
      // TODO configure more colors in theme?
      // new IconConfig(Icons.PageView, (id: number) => this.viewItem.emit(id), 'accent'),
      new IconConfig(Icons.PageView, (id: number) => this.viewItem.emit(id)),
      new IconConfig(Icons.Delete, (id: number) => this.deleteItem.emit(id), 'warn'),
    ].filter((i) => i.onClick != null);
  }

  validateList(): void {
    if (this.tableHeaders?.length > 0 && this.tableHeaders.length === this.tableKeys?.length)
      return;

    throw new InvalidTableConfigError(this.tableHeaders, this.tableKeys);
  }

  canShowActions = () => this.copyItem != null || this.editItem != null || this.deleteItem != null;
}
