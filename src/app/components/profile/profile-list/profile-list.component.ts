import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ODataOperators } from 'src/app/helpers/odata';
import { PaginationOptions } from 'src/app/helpers/pagination-options';
import { TableConfig } from 'src/app/models/configs/table-config';
import { Profile } from 'src/app/models/entities';
import { ProfileService, ToastService } from 'src/app/services';
import { FilterService } from 'src/app/services/filter.service';
import { ModalService } from 'src/app/services/modal.service';
import { deleteModalData, paths } from 'src/app/utils';

@Component({
  selector: 'app-profile-list [items]',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss'],
})
export class ProfileListComponent implements OnInit {
  @Input() items!: Profile[];
  @Input() totalItems = 0;

  filterForm!: FormGroup<{
    name: FormControl<string | null>;
  }>;

  config: TableConfig<Profile> = {
    headers: Profile.tableHeaders(),
    keys: Profile.tableKeys(),
    detailsUrl: paths.profilesDetails,
    hasCopy: true,
    hasDelete: true,
    hasEdit: true,
    hasView: true,
  };

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
      name: new FormControl('', [Validators.maxLength(250)]),
    });

    this.filterForm = form;
  }

  // TODO implement filter logic
  onFilter(filter: string): void {
    this.filterService.filterDebounced(this.loadFilteredItems.bind(this));
  }

  applyFilter(): void {
    this.filterService.cancelPreviousCall();
    this.loadFilteredItems();
  }

  async loadFilteredItems(): Promise<void> {
    const { name: nameFilter } = this.filterForm.value;

    // TODO call on items per page
    const itemsPerPage = 10;
    await this.service.loadListItems(
      PaginationOptions.first(itemsPerPage, {
        filter: { name: [ODataOperators.Contains, nameFilter ?? ''] },
      })
    );
  }

  async paginate(event: PageEvent): Promise<void> {
    if (event == null) {
      this.ts.error('Error while paginating');
      return;
    }

    const { pageIndex, pageSize } = event;
    this.service.loadListItems(PaginationOptions.from(pageIndex + 1, pageSize));
  }

  private deleteItem = async (id: number) => {
    await this.service.deleteItem(id);
  };

  openDeleteModal(id: number): void {
    const ref = this.modalService.confirmation(deleteModalData());

    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      this.deleteItem(id);
    });
  }
}
