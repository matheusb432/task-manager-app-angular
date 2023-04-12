import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title [title]',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
})
export class TitleComponent {
  @Input() title!: string;

  @Input() subtitle?: string;
}
