import { Component } from '@angular/core';
import { paths } from 'src/app/utils';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent {
  paths = paths;
}
