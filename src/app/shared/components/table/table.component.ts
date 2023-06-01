import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Mapper } from 'mapper-ts/lib-esm';
import { of } from 'rxjs';
import { ObjectUtil } from 'src/app/util';
import {
  IconConfig,
  OrderByConfig,
  TableConfig,
  TableItem,
  TableItemConfig,
  TableKey,
} from 'src/app/models';
import { LoadingService } from 'src/app/services/loading.service';
import { ArrayUtil, DetailsTypes, Icons, StringUtil } from 'src/app/util';
import { DynamicPipe } from '../../../pipes/dynamic.pipe';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconComponent } from '../icon/icon.component';
import { NgFor, NgClass, NgIf, AsyncPipe } from '@angular/common';
import { SetIdDirective } from '../../../directives/set-id.directive';

@Component({
  selector: 'app-table [items] [config]',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SetIdDirective,
    NgFor,
    NgClass,
    NgIf,
    IconComponent,
    MatTooltipModule,
    LoadingComponent,
    AsyncPipe,
    DynamicPipe,
  ],
})
export class TableComponent<T extends TableItem> implements OnInit, OnChanges {
  @Input() items!: T[];
  @Input() config!: TableConfig<T>;
  @Input() elId = 'cTableContainer';

  @Output() deleteItem = new EventEmitter<number>();
  @Output() orderByChanged = new EventEmitter<OrderByConfig<T> | null>();

  private _orderedItems: T[] = [];

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

  get orderedItems(): T[] {
    return this._orderedItems;
  }
  set orderedItems(value: T[]) {
    const itemType = this.config?.itemType;
    if (itemType == null) {
      this._orderedItems = value;
      return;
    }

    this._orderedItems = new Mapper(itemType).map(value) as T[];
  }

  ngOnInit(): void {
    this.initIcons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elId']) {
      this.isLoading$ = this.loadingService.isLoadingById$(this.elId);
    }

    if (changes['items'] || changes['sortColumn'] || changes['sortDirection']) {
      this.orderedItems = this.orderItems(this.items);
    }
  }

  initIcons(): void {
    const { hasCopy, hasDelete, hasEdit, hasView } = this.config;

    const icons = [];
    if (hasCopy) {
      icons.push({
        ...IconConfig.withUrlType('DuplicateIcon', Icons.ContentCopy, DetailsTypes.Duplicate),
        title: 'Duplicate',
      });
    }
    if (hasEdit) {
      icons.push({
        ...IconConfig.withUrlType('EditIcon', Icons.Edit, DetailsTypes.Edit),
        title: 'Edit',
      });
    }
    if (hasView) {
      icons.push({
        ...IconConfig.withUrlType('ViewIcon', Icons.PageView, DetailsTypes.View),
        title: 'View',
      });
    }
    if (hasDelete) {
      icons.push({
        ...IconConfig.withClick(
          'DeleteIcon',
          Icons.Delete,
          (id: number) => this.deleteItem.emit(id),
          'warn'
        ),
        title: 'Delete',
      });
    }

    this.icons = icons;
  }

  canShowActions = () => StringUtil.notEmpty(this.icons);

  getItemId(index: number, item: T): number {
    return item?.id ?? index;
  }

  private getOrderBy(): OrderByConfig<T> | null {
    return this.config.orderBy;
  }

  private setOrderBy(orderBy: OrderByConfig<T> | null): void {
    this.config.orderBy = orderBy == null ? null : { ...orderBy };
    this.orderedItems = this.orderItems(this.items);
    this.orderByChanged.emit(orderBy);
  }

  onOrderBy(columnKey: TableKey<T>): void {
    const newOrderBy = ArrayUtil.onOrderByChange(this.getOrderBy(), columnKey);
    this.setOrderBy(newOrderBy);
  }

  getPropValue(item: T, key: TableKey<T>, defaultsTo: unknown = null): unknown {
    if (!Array.isArray(key)) return item[key];

    return ObjectUtil.getPropValue(item, ObjectUtil.keyToProp(key), defaultsTo);
  }

  orderItems(items: T[]): T[] {
    const orderBy = this.getOrderBy();

    if (!orderBy) return ObjectUtil.deepClone(items);

    return ArrayUtil.orderItems(items, orderBy.key, orderBy.direction);
  }
}