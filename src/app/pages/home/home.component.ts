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

    this.toastService.warning(
      'The quick brown fox jumps over the lazy dog. With a hint of lorem ipsum'
    );
  }
}
