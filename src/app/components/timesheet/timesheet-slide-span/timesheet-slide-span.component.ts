import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../custom/icon/icon.component';
import { Icons } from 'src/app/util';

@Component({
  selector: 'app-timesheet-slide-span [titleText] [icon]',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <span class="data" [ngClass]="ngClass" [title]="titleText">
      <app-icon [icon]="icon"></app-icon>
      <ng-content></ng-content>
      <ng-container *ngIf="profileText"> / {{ profileText }} </ng-container>
    </span>
  `,
  styles: [
    `
      .data {
        width: 100%;

        &.fail {
          color: var(--danger);
        }

        &.success {
          color: green;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetSlideSpanComponent {
  @Input() titleText!: string;
  @Input() icon!: Icons;
  @Input() ngClass?: object;
  @Input() profileText?: string;
  Icons = Icons;
}
