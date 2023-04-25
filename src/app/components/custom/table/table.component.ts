import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { of } from 'rxjs';
import { us } from 'src/app/helpers';
import { InvalidTableConfigError } from 'src/app/helpers/errors';
import { IconConfig } from 'src/app/models/configs';
import { TableConfig } from 'src/app/models/configs/table-config';
import { TableItem } from 'src/app/models/types';
import { LoadingService } from 'src/app/services/loading.service';
import { DetailsTypes, Icons } from 'src/app/utils';

@Component({
  selector: 'app-table [items] [config]',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T extends TableItem> implements OnInit, OnChanges {
  @Input() items!: T[];
  @Input() config!: TableConfig<T>;
  @Input() elId = 'cTableContainer';

  @Output() deleteItem = new EventEmitter<number>();

  isLoading$ = of(false);

  icons: IconConfig<number>[] = [];

  constructor(private loadingService: LoadingService) {}

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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.tableHeaders != null && this.tableKeys != null) this.validateList();

    if (changes['elId']) {
      this.isLoading$ = this.loadingService.isLoadingPipeFactory(this.elId);
    }
  }

  initIcons(): void {
    const { hasCopy, hasDelete, hasEdit, hasView } = this.config;
    const icons = [
      !!hasCopy && IconConfig.withUrlType('DuplicateIcon',Icons.ContentCopy, DetailsTypes.Duplicate),
      !!hasEdit && IconConfig.withUrlType('EditIcon', Icons.Edit, DetailsTypes.Edit),
      !!hasView && IconConfig.withUrlType('ViewIcon', Icons.PageView, DetailsTypes.View),
      !!hasDelete &&
        IconConfig.withClick('DeleteIcon', Icons.Delete, (id: number) => this.deleteItem.emit(id), 'warn'),
    ].filter((i) => !!i);

    this.icons = icons as IconConfig<number>[];
  }

  buildUrl = (): string => this.detailsUrl;
  buildQueryParams = (id: number, type: DetailsTypes): { id: string; type: DetailsTypes } => ({
    id: id.toString(),
    type,
  });

  validateList(): void {
    if (us.notEmpty(this.tableHeaders) && this.tableHeaders.length === this.tableKeys?.length)
      return;

    throw new InvalidTableConfigError(this.tableHeaders, this.tableKeys);
  }

  canShowActions = () => us.notEmpty(this.icons);

  getItemId(index: number, item: T): number {
    return item?.id ?? index;
  }
}
