import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-title [titleText]',
  template: `
    <header>
      <h1 class="title">{{ titleText }}</h1>
      <h2 *ngIf="subtitle" class="subtitle">{{ subtitle }}</h2>
    </header>
  `,
  styles: [
    `
      header {
        .title {
          font-size: 1.875rem;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: 0.05rem;
        }

        .subtitle {
          font-size: 1.25rem;
          font-weight: 400;
          letter-spacing: 0.1rem;
          opacity: 0.6;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleComponent {
  @Input() titleText!: string;
  @Input() subtitle?: string;
}
