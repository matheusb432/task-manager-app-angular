import { Component } from '@angular/core';
import { Icons } from 'src/app/utils';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent {
  Icons = Icons;
}
