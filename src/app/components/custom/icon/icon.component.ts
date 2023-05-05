import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { DetailsTypes, Icons } from 'src/app/util';

@Component({
  selector: 'app-icon [icon]',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @Input() icon!: Icons;
  @Input() color: ThemePalette = 'primary';
  @Input() ariaLabelText = 'Icon';
  @Input() url?: string;
  @Input() size = 24;
  @Input() clickable = false;
  @Input() queryParams?: Record<string, string>;
  @Input() title = '';
  @Input() elId = '';

  @Output() clicked = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    console.warn('changes in icon!');
  }

  checkRender(): boolean {
    if(this.url)console.log(this.url);
    console.log('checkRender icon');
    return true;
  }

  buildQueryParams = (id: number, type: DetailsTypes): { id: string; type: DetailsTypes } => ({
    id: id.toString(),
    type,
  });
}
