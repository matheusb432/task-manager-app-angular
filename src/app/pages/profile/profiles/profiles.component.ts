import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services';
import { paths } from 'src/app/util';
import { Profile } from 'src/app/models';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss'],
})
export class ProfilesComponent implements OnInit {

  paths = paths;

  // TODO clean
  // listItems$!: Observable<Profile[]>;
  // total$!: Observable<number>;
  // get listItems() {
  //   return this.service.listItems;
  // }

  // get total() {
  //   return this.service.total;
  // }

  constructor(private service: ProfileService) {}

  ngOnInit(): void {
    this.service.loadListData();
  }

  goToCreate() {
    this.service.goToCreate();
  }
}
