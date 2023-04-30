import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { us } from 'src/app/helpers';
import { IconConfig } from 'src/app/models/configs';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-input [fcName] [control] [fg] [labelText]',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnDestroy, OnChanges {
  @Input() fcName!: string;
  @Input() control!: AbstractControl | null;
  @Input() fg!: FormGroup;
  @Input() labelText!: string;
  @Input() labelIcon?: IconConfig<never>;
  @Input() type = 'text';
  @Input() helperText?: string;
  @Input() errText?: string;
  @Input() placeholder = '';
  @Input() elId = '';
  @Input() canEdit = true;
  @Input() formId = '';
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Input() isInvalid = () => !!this.control && this.control.invalid && this.control.touched;

  @Output() keydownPressed = new EventEmitter<KeyboardEvent>();

  isLoading = false;

  subscriptions: Subscription[] = [];

  get invalid(): boolean {
    return this.isInvalid();
  }

  get disabled(): boolean {
    return !!this.control?.disabled;
  }

  constructor(private loadingService: LoadingService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['formId'] && !!this.formId) || (changes['elId'] && !!this.elId)) {
      this.initLoadingSubscription();
    }

    if (changes['control'] || changes['canEdit']) {
      this.changeControlEnabled();
    }
  }

  ngOnDestroy(): void {
    us.unsub(this.subscriptions);
  }

  initLoadingSubscription(): void {
    us.unsub(this.subscriptions);

    this.subscriptions.push(
      this.loadingService
        .isAnyLoadingPipeFactory([this.elId, this.formId])
        .subscribe((isLoading) => {
          this.isLoading = isLoading;

          this.changeControlEnabled();
        })
    );
  }

  changeControlEnabled(): void {
    if (!this.isLoading && this.canEdit) this.control?.enable();
    else this.control?.disable();
  }

  getErrText(): string {
    const errors = this.control?.errors;

    if (errors == null) return this.errText || 'Invalid field';
    if (errors['required']) return 'This field is required';
    return 'Invalid input';
  }
}
