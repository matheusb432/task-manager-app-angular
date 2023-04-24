import { Component } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  get size(): number {
    return this.service.size;
  }

  get isLoading(): boolean {
    return this.service.isLoading;
  }

  constructor(private service: LoadingService) {}
}
