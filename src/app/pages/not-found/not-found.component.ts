import { Component } from '@angular/core';
import { paths } from 'src/app/util';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
  paths = paths;
}
