import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { ODataOperators } from 'src/app/helpers/odata';
import { Profile, TableConfig } from 'src/app/models';
import { PaginationOptions } from 'src/app/models/configs/pagination-options';
import { ProfileService, ToastService } from 'src/app/services';
import { FilterService } from 'src/app/services/filter.service';
import { ModalService } from 'src/app/services/modal.service';
import { ElementIds, QueryUtil, deleteModalData, paths } from 'src/app/util';
import { AsyncPipe } from '@angular/common';
import { PaginationComponent } from '../../custom/pagination/pagination.component';
import { TableComponent } from '../../custom/table/table.component';
import { SearchComponent } from '../../custom/inputs/search/search.component';
import { FormLayoutComponent } from '../../layout/form-layout/form-layout.component';

@Component({
    selector: 'app-profile-list',
    templateUrl: './profile-list.component.html',
    styleUrls: ['./profile-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FormLayoutComponent, ReactiveFormsModule, SearchComponent, TableComponent, PaginationComponent, AsyncPipe]
})
export class ProfileListComponent implements OnInit {
  listItems$: Observable<Profile[]>;
  total$: Observable<number>;
  lastOptions$: Observable<PaginationOptions>;

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

  constructor(
    private service: ProfileService,
    private ts: ToastService,
    private modalService: ModalService,
    private filterService: FilterService
  ) {
    this.listItems$ = this.service.listItems$;
    this.total$ = this.service.total$;
    this.lastOptions$ = this.service.lastOptions$;
  }

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
    this.service.goToList();
  };

  private getPaginationQuery(page: number, itemsPerPage?: number): PaginationOptions {
    return PaginationOptions.from(page, itemsPerPage ?? this.service.getItemsPerPage(), {
      filter: { name: this.prevFilter ? [[ODataOperators.Contains, this.prevFilter]] : undefined },
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
