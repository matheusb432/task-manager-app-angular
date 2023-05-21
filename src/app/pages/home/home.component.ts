import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs';
import { Card } from 'src/app/models';
import { ToastService } from 'src/app/services';
import { homeCards } from 'src/app/util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  cards: Card[] = homeCards;
  toastCount$ = this.toastService.toastCount$.pipe(map((count) => count.toString()));

  constructor(private toastService: ToastService) {}

  openToast(): void {
    const now = new Date().getTime();
    const randBetween1and4 = Math.floor(Math.random() * 4) + 1;
    console.log(now);
    console.log(randBetween1and4);
    switch (randBetween1and4) {
      case 1:
        this.toastService.info('Toast of ' + now);
        break;
      case 2:
        this.toastService.warning('Toast of ' + now);
        break;
      case 3:
        this.toastService.error('Toast of ' + now);
        break;
      default:
        this.toastService.success('Toast of ' + now);
        break;
    }
  }
}
