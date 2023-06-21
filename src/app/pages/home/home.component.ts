import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Card } from 'src/app/models';
import { ToastService } from 'src/app/services';
import { CardsGridComponent } from 'src/app/shared/components/cards-grid/cards-grid.component';
import { PageLayoutComponent } from 'src/app/shared/components/layouts/page-layout/page-layout.component';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { homeCards } from 'src/app/util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageLayoutComponent, TitleComponent, CardsGridComponent],
})
export class HomeComponent {
  cards: Card[] = homeCards;
  // private toaster = inject(ToastService);

  // openToast(): void {
  //   this.toaster.success('This is a toast message!');
  // }
}
