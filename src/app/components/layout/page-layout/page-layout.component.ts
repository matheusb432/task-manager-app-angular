import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-layout',
  template: `<app-sidebar>
    <div class="container">
      <ng-content></ng-content>
    </div>
  </app-sidebar>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutComponent {}
