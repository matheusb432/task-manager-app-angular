import { Component, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PaginationOptions } from 'src/app/helpers/pagination-options';
import { TableConfig } from 'src/app/models/configs/table-config';
import { Profile } from 'src/app/models/entities';
import { ProfileService, ToastService } from 'src/app/services';
import { ModalService } from 'src/app/services/modal.service';
import { deleteModalData, paths } from 'src/app/utils';

@Component({
  selector: 'app-profile-list [items]',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss'],
})
export class ProfileListComponent {
  @Input() items!: Profile[];
  @Input() totalItems = 0;

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
    private modalService: ModalService
  ) {}

  async paginate(event: PageEvent): Promise<void> {
    if (event == null) {
      this.ts.error('Error while paginating');
      return;
    }

    const { pageIndex, pageSize } = event;
    this.service.loadListItems(PaginationOptions.from(pageIndex, pageSize));
  }

  // TODO refactor to service?
  private deleteItem = async (id: number) => {
    await this.service.remove(id);

    this.items = this.items.filter((t) => t.id !== id);

    this.ts.success('Profile deleted successfully');
  };

  openDeleteModal(id: number): void {
    const ref = this.modalService.confirmation(deleteModalData());

    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      this.deleteItem(id);
    });
  }
}
