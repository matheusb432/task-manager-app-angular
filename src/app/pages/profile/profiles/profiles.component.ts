import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services';
import { paths } from 'src/app/util';
import { RouterOutlet } from '@angular/router';
import { ProfileListComponent } from '../../../components/profile/profile-list/profile-list.component';
import { ButtonComponent } from '../../../components/custom/buttons/button/button.component';
import { TitleComponent } from '../../../components/custom/title/title.component';
import { PageLayoutComponent } from '../../../components/layout/page-layout/page-layout.component';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PageLayoutComponent,
    TitleComponent,
    ButtonComponent,
    ProfileListComponent,
    RouterOutlet,
  ],
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
