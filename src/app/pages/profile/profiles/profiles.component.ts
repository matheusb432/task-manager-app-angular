import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services';
import { paths } from 'src/app/utils';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss'],
})
export class ProfilesComponent implements OnInit {
  paths = paths;

  get listItems() {
    return this.service.listItems;
  }

  constructor(private service: ProfileService) {}

  ngOnInit(): void {
    this.service.loadListItems();
  }

  goToCreate() {
    this.service.goToCreate();
  }
}
