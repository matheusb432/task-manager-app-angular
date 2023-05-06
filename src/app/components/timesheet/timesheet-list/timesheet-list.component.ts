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
export class TimesheetListComponent implements OnInit {
  @Input() items!: Timesheet[];
  @Input() totalItems = 0;

  filterForm!: FormGroup<{
    date: FormControl<Date>;
  }>;

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

  prevFilter?: string;

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

  ngOnInit(): void {
    // TODO implement
    // this.initFilterForm();
  }

  // initFilterForm(): void {
  //   const form = new FormGroup({
  //     date: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(250)] }),
  //   });

  //   this.filterForm = form;
  // }

  onFilter(): void {
    this.filterService.filterDebounced(this.loadFilteredItems.bind(this));
  }

  applyFilter(): void {
    this.filterService.cancelPreviousCall();
    this.loadFilteredItems();
  }

  async loadFilteredItems(): Promise<void> {
    // const { name: nameFilter } = this.filterForm.value;

    // if (nameFilter === this.prevFilter) return;
    // this.prevFilter = nameFilter;
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
      filter: { name: this.prevFilter ? [ODataOperators.Contains, this.prevFilter] : undefined },
      orderBy: QueryUtil.orderByToOData(this.config.orderBy),
    });
  }

  openDeleteModal(id: number): void {
    const ref = this.modalService.confirmation(deleteModalData());

    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      this.deleteItem(id);
    });
  }

  handleOrderBy(): void {
    this.service.loadListItems(this.getPaginationQuery(1));
  }
}
