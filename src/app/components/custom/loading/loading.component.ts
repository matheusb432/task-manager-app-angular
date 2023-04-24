import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading [isLoading]',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  @Input() isLoading!: boolean | null;
  @Input() size = 100;
}
