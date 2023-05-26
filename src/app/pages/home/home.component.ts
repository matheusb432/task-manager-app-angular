import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'src/app/models';
import { homeCards } from 'src/app/util';
import { CardsGridComponent } from '../../components/custom/cards-grid/cards-grid.component';
import { TitleComponent } from '../../components/custom/title/title.component';
import { PageLayoutComponent } from '../../components/layout/page-layout/page-layout.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [PageLayoutComponent, TitleComponent, CardsGridComponent]
})
export class HomeComponent {
  cards: Card[] = homeCards;
}
