import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { Profile, TableConfig, Timesheet, WithDestroyed } from 'src/app/models';
import { PaginationOptions } from 'src/app/models/configs/pagination-options';
import {
  FilterService,
  ModalService,
  ProfileService,
  TimesheetService,
  ToastService,
} from 'src/app/services';
import { ElementIds, QueryUtil, deleteModalData, paths } from 'src/app/util';

@Component({
  selector: 'app-timesheet-list',
  templateUrl: './timesheet-list.component.html',
  styleUrls: ['./timesheet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetListComponent extends WithDestroyed {
  listItems$: Observable<Timesheet[]>;
  profiles$: Observable<Profile[]>;
  total$: Observable<number>;
  lastOptions$: Observable<PaginationOptions>;

  config: TableConfig<Timesheet> = {
    itemConfigs: Timesheet.tableItems(),
    orderBy: { key: 'id', direction: 'asc' },
    itemType: Timesheet,
    detailsUrl: paths.timesheetsDetails,
    hasCopy: true,
    hasDelete: true,
    hasEdit: true,
    hasView: true,
  };

  elIds = ElementIds;

  constructor(
    private service: TimesheetService,
    private profileService: ProfileService,
    private ts: ToastService,
    private modalService: ModalService,
    private filterService: FilterService
  ) {
    super();
    this.listItems$ = this.service.listItems$;
    this.total$ = this.service.total$;
    this.lastOptions$ = this.service.lastOptions$;
    this.profiles$ = this.profileService.listItems$;
  }

  onFilter(): void {
    this.filterService.filterDebounced(this.loadItems.bind(this));
  }

  applyFilter(): void {
    this.filterService.cancelPreviousCall();
    this.loadItems();
  }

  async loadItems(): Promise<void> {
    await this.service.loadListItems(this.getPaginationQuery(1));
  }

  async paginate(event: PageEvent): Promise<void> {
    if (event == null) {
      this.ts.error('Error while paginating');
      return;
    }

    const { pageIndex, pageSize } = event;
    this.service.loadListItems(this.getPaginationQuery(pageIndex + 1, pageSize));
  }

  private deleteItem = async (id: number) => {
    await this.service.deleteItem(id);
    this.service.goToList();
  };

  private getPaginationQuery(page: number, itemsPerPage?: number): PaginationOptions {
    return PaginationOptions.from(page, itemsPerPage ?? this.service.getItemsPerPage(), {
      orderBy: QueryUtil.orderByToOData(this.config.orderBy),
    });
  }

  openDeleteModal(id: number): void {
    this.modalService.confirmation(deleteModalData(), () => this.deleteItem(id));
  }

  handleOrderBy(): void {
    this.service.loadListItems(this.getPaginationQuery(1));
  }
}
