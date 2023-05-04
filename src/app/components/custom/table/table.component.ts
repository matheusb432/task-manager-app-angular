import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { of } from 'rxjs';
import { us } from 'src/app/helpers';
import { IconConfig, OrderByConfig, TableConfig, TableItem, TableItemConfig } from 'src/app/models';
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
  @Output() orderByChanged = new EventEmitter<OrderByConfig<T> | null>();

  orderedItems: T[] = [];

  isLoading$ = of(false);

  icons: IconConfig<number>[] = [];

  Icons = Icons;

  constructor(private loadingService: LoadingService) {}

  get itemConfigs(): TableItemConfig<T>[] {
    return this.config.itemConfigs;
  }

  get orderBy(): OrderByConfig<T> | null {
    return this.config.orderBy;
  }

  get detailsUrl(): string {
    return this.config.detailsUrl;
  }

  ngOnInit(): void {
    this.initIcons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elId']) {
      this.isLoading$ = this.loadingService.isLoadingPipeFactory(this.elId);
    }

    if (changes['items'] || changes['sortColumn'] || changes['sortDirection']) {
      this.orderedItems = this.orderItems(this.items);
    }
  }

  initIcons(): void {
    const { hasCopy, hasDelete, hasEdit, hasView } = this.config;
    const icons = [
      !!hasCopy &&
        IconConfig.withUrlType('DuplicateIcon', Icons.ContentCopy, DetailsTypes.Duplicate),
      !!hasEdit && IconConfig.withUrlType('EditIcon', Icons.Edit, DetailsTypes.Edit),
      !!hasView && IconConfig.withUrlType('ViewIcon', Icons.PageView, DetailsTypes.View),
      !!hasDelete &&
        IconConfig.withClick(
          'DeleteIcon',
          Icons.Delete,
          (id: number) => this.deleteItem.emit(id),
          'warn'
        ),
    ].filter((i) => !!i);

    this.icons = icons as IconConfig<number>[];
  }

  buildUrl = (): string => this.detailsUrl;
  buildQueryParams = (id: number, type: DetailsTypes): { id: string; type: DetailsTypes } => ({
    id: id.toString(),
    type,
  });

  canShowActions = () => us.notEmpty(this.icons);

  getItemId(index: number, item: T): number {
    return item?.id ?? index;
  }

  private getOrderBy(): OrderByConfig<T> | null {
    return this.config.orderBy;
  }

  private setOrderBy(orderBy: OrderByConfig<T> | null): void {
    this.config.orderBy = orderBy;
    this.orderedItems = this.orderItems(this.items);
    this.orderByChanged.emit(orderBy);
  }

  onOrderBy(columnKey: keyof T): void {
    const newOrderBy = us.onOrderByChange(this.getOrderBy(), columnKey);
    this.setOrderBy(newOrderBy);
  }

  orderItems(items: T[]): T[] {
    const orderBy = this.getOrderBy();

    if (!orderBy) return us.deepClone(items);

    return us.orderItems(items, orderBy.key, orderBy.direction);
  }
}
