import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { us } from 'src/app/helpers';
import { ODataOperators } from 'src/app/helpers/odata';
import { PaginationOptions } from 'src/app/helpers/pagination-options';
import { TableConfig } from 'src/app/models/configs/table-config';
import { Profile } from 'src/app/models/entities';
import { ProfileService, ToastService } from 'src/app/services';
import { FilterService } from 'src/app/services/filter.service';
import { ModalService } from 'src/app/services/modal.service';
import { ElementIds, deleteModalData, paths } from 'src/app/utils';

@Component({
  selector: 'app-profile-list [items]',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss'],
})
export class ProfileListComponent implements OnInit {
  @Input() items!: Profile[];
  @Input() totalItems = 0;

  filterForm!: FormGroup<{
    name: FormControl<string>;
  }>;

  config: TableConfig<Profile> = {
    itemConfigs: Profile.tableItems(),
    orderBy: { key: 'id', direction: 'asc' },
    detailsUrl: paths.profilesDetails,
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
    private service: ProfileService,
    private ts: ToastService,
    private modalService: ModalService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.initFilterForm();
  }

  initFilterForm(): void {
    const form = new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(250)] }),
    });

    this.filterForm = form;
  }

  onFilter(): void {
    this.filterService.filterDebounced(this.loadFilteredItems.bind(this));
  }

  applyFilter(): void {
    this.filterService.cancelPreviousCall();
    this.loadFilteredItems();
  }

  async loadFilteredItems(): Promise<void> {
    const { name: nameFilter } = this.filterForm.value;

    if (nameFilter === this.prevFilter) return;
    this.prevFilter = nameFilter;
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
      orderBy: us.orderByToOData(this.config.orderBy),
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
