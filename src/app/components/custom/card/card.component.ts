import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card [titleText] [content]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() titleText!: string;
  @Input() content!: string;
  @Input() imgUrl?: string;
  @Input() imgAlt?: string;
  @Input() url?: string;
}
