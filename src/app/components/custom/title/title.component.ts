import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title [titleText]',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
})
export class TitleComponent {
  @Input() titleText!: string;

  @Input() subtitle?: string;
}
