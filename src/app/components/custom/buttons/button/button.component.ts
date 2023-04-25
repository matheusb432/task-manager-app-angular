import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  OnDestroy,
  ContentChild,
  ElementRef,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Subscription, of } from 'rxjs';
import { us } from 'src/app/helpers';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnChanges, OnDestroy {
  @Input() disabled = false;
  @Input() color: ThemePalette = 'primary';
  @Input() type: 'submit' | 'button' = 'button';
  @Input() url?: string;
  @Input() model: 'raised' | 'stroked' | 'flat' | 'icon' | 'fab' | 'mini-fab' | 'link' | '' = '';
  @Input() elId?: string;

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  isLoading = false;
  subscriptions: Subscription[] = [];

  get isDisabled(): boolean {
    return this.isLoading || this.disabled;
  }

  constructor(private loadingService: LoadingService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elId'] && !!this.elId) {
      this.initLoadingSubscription();
    }
  }

  ngOnDestroy(): void {
    us.unsub(this.subscriptions);
  }

  initLoadingSubscription(): void {
    us.unsub(this.subscriptions);

    if (!this.elId) return;

    this.subscriptions.push(
      this.loadingService.isLoadingPipeFactory(this.elId).subscribe((isLoading) => {
        if (isLoading) console.log('is Loading!');
        this.isLoading = isLoading;
      })
    );
  }

  emitClick = (): void => this.clicked.emit();
}
