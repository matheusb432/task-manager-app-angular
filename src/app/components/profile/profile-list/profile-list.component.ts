import { Component, Input } from '@angular/core';
import { Profile } from 'src/app/models/entities';
import { ProfileService, ToastService } from 'src/app/services';
import { DetailsTypes } from 'src/app/utils';

@Component({
  selector: 'app-profile-list [items]',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent {
  @Input() items!: Profile[];

  tableHeaders = Profile.tableHeaders();
  tableKeys = Profile.tableKeys();

  constructor(private service: ProfileService, private ts: ToastService) {
  }

  // TODO implement
  async paginate(event: any): Promise<void> {
    console.log(event);
  }

  viewItem = (id: number) => this.service.goToDetails(id, DetailsTypes.View);
  copyItem = (id: number) => this.service.goToDetails(id, DetailsTypes.Duplicate);
  editItem = (id: number) => this.service.goToDetails(id, DetailsTypes.Edit);
  // TODO implement modal confirmation
  deleteItem = async (id: number) => {
    // TODO test
    await this.service.remove(id);

    this.items = this.items.filter((t) => t.id !== id);

    this.ts.success('Profile deleted successfully');
  };
}
