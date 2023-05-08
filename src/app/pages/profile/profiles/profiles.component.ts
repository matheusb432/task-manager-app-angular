import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services';
import { paths } from 'src/app/util';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss'],
})
export class ProfilesComponent implements OnInit {
  paths = paths;

  constructor(private service: ProfileService) {}

  ngOnInit(): void {
    this.service.loadListData();
  }

  goToCreate() {
    this.service.goToCreate();
  }
}
