import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { Profile, TableConfig, Timesheet, WithDestroyed } from 'src/app/models';
import { PaginationOptions } from 'src/app/models/configs/pagination-options';
import { AppService, FilterService, ModalService, ToastService } from 'src/app/services';
import { ElementIds, QueryUtil, deleteModalData, paths } from 'src/app/util';
import { AsyncPipe } from '@angular/common';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { TimesheetService } from '../../services/timesheet.service';
import { ProfileService } from 'src/app/pages/profile/services/profile.service';

@Component({
  selector: 'app-timesheet-list',
  templateUrl: './timesheet-list.component.html',
  styleUrls: ['./timesheet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TableComponent, PaginationComponent, AsyncPipe],
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
    private app: AppService,
    private service: TimesheetService,
    private profileService: ProfileService,
    private toaster: ToastService,
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
      this.toaster.error('Error while paginating');
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
    const { start, end } = this.app.getDateRangeOrDefault();

    return PaginationOptions.from(page, itemsPerPage ?? this.service.getItemsPerPage(), {
      orderBy: QueryUtil.orderByToOData(this.config.orderBy),
      filter: {
        ...QueryUtil.getDateRangeFilter('date', start, end),
      },
    });
  }

  openDeleteModal(id: number): void {
    this.modalService.confirmation(deleteModalData(), () => this.deleteItem(id));
  }

  handleOrderBy(): void {
    this.service.loadListItems(this.getPaginationQuery(1));
  }
}
