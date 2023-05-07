import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ODataOperators } from 'src/app/helpers/odata';
import { PaginationOptions } from 'src/app/models/configs/pagination-options';
import { TableConfig, Timesheet } from 'src/app/models';
import { FilterService, ModalService, TimesheetService, ToastService } from 'src/app/services';
import { ElementIds, QueryUtil, deleteModalData, paths } from 'src/app/util';

@Component({
  selector: 'app-timesheet-list',
  templateUrl: './timesheet-list.component.html',
  styleUrls: ['./timesheet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetListComponent {
  @Input() items!: Timesheet[];
  @Input() totalItems = 0;

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

  get currentPage(): number {
    return this.service.currentPage;
  }

  get itemsPerPage(): number {
    return this.service.itemsPerPage;
  }

  constructor(
    private service: TimesheetService,
    private ts: ToastService,
    private modalService: ModalService,
    private filterService: FilterService
  ) {}

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
  };

  private getPaginationQuery(page: number, itemsPerPage?: number): PaginationOptions {
    return PaginationOptions.from(page, itemsPerPage ?? this.itemsPerPage, {
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
