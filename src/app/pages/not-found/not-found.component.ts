import { Component } from '@angular/core';
import { paths } from 'src/app/util';
import { ButtonComponent } from '../../components/custom/buttons/button/button.component';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  standalone: true,
  imports: [ButtonComponent],
})
export class NotFoundComponent {
  paths = paths;
}
