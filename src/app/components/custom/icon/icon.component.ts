import { MatIconModule } from '@angular/material/icon';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { DetailsTypes, Icons } from 'src/app/util';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-icon [icon]',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
})
export class IconComponent implements OnChanges {
  @Input() icon!: Icons;
  @Input() color: ThemePalette = 'primary';
  @Input() ariaLabelText = 'Icon';
  @Input() url?: string;
  @Input() size = 24;
  @Input() clickable = false;
  @Input() urlType?: DetailsTypes;
  @Input() title = '';
  @Input() elId = '';
  @Input() itemId?: number | undefined;

  @Output() clicked = new EventEmitter<void>();

  queryParams?: Record<string, string>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['urlType'] || changes['itemId']) {
      this.updateQueryParamsIfNecessary();
    }
  }

  private buildQueryParams = (
    id: number,
    type: DetailsTypes
  ): { id: string; type: DetailsTypes } => ({
    id: id.toString(),
    type,
  });

  private updateQueryParamsIfNecessary(): void {
    if (!this.urlType || this.itemId == null) return;

    this.queryParams = this.buildQueryParams(this.itemId, this.urlType);
  }
}
