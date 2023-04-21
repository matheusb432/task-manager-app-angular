import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { us } from 'src/app/helpers';
import { InvalidTableConfigError } from 'src/app/helpers/errors';
import { IconConfig } from 'src/app/models/configs';
import { TableConfig } from 'src/app/models/configs/table-config';
import { TableItem } from 'src/app/models/types';
import { DetailsTypes, Icons } from 'src/app/utils';

@Component({
  selector: 'app-table [items] [config]',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T extends TableItem> implements OnInit, OnChanges {
  @Input() items!: T[];
  @Input() config!: TableConfig<T>;

  @Output() deleteItem = new EventEmitter<number>();

  icons: IconConfig<number>[] = [];

  get tableHeaders(): string[] {
    return this.config.headers;
  }

  get tableKeys(): (keyof T)[] {
    return this.config.keys;
  }

  get detailsUrl(): string {
    return this.config.detailsUrl;
  }

  ngOnInit(): void {
    this.initIcons();
  }

  ngOnChanges(): void {
    if (this.tableHeaders != null && this.tableKeys != null) this.validateList();
  }

  initIcons(): void {
    const { hasCopy, hasDelete, hasEdit, hasView } = this.config;
    const icons = [
      !!hasCopy && IconConfig.withUrlType(Icons.ContentCopy, DetailsTypes.Duplicate),
      !!hasEdit && IconConfig.withUrlType(Icons.Edit, DetailsTypes.Edit),
      !!hasView && IconConfig.withUrlType(Icons.PageView, DetailsTypes.View),
      !!hasDelete &&
        IconConfig.withClick(Icons.Delete, (id: number) => this.deleteItem.emit(id), 'warn'),
    ].filter((i) => !!i);

    this.icons = icons as IconConfig<number>[];
  }

  buildUrl = (): string => this.detailsUrl;
  buildQueryParams = (id: number, type: DetailsTypes): { id: string; type: DetailsTypes } => ({
    id: id.toString(),
    type,
  });

  validateList(): void {
    if (us.hasItems(this.tableHeaders) && this.tableHeaders.length === this.tableKeys?.length)
      return;

    throw new InvalidTableConfigError(this.tableHeaders, this.tableKeys);
  }

  canShowActions = () => us.hasItems(this.icons);

  getItemId(index: number, item: T): number {
    return item?.id ?? index;
  }
}
