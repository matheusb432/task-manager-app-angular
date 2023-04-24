import { Component, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { us } from 'src/app/helpers';
import { SelectOption } from 'src/app/models/configs';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-select [fcName] [control] [fg] [labelText] [options]',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnDestroy, OnChanges {
  @Input() fcName!: string;
  @Input() control!: AbstractControl | null;
  @Input() fg!: FormGroup;
  @Input() labelText!: string;
  @Input() options!: SelectOption[] | null;
  @Input() placeholder = '';
  @Input() invalid?: boolean;
  @Input() helperText?: string;
  @Input() errText?: string;
  @Input() multiple?: boolean = false;
  @Input() canEdit = true;
  @Input() elId = '';
  @Input() compareWithFn: (o1: unknown, o2: unknown) => boolean = (o1: unknown, o2: unknown) =>
    o1 === o2;

  isLoading = false;

  subscriptions: Subscription[] = [];

  constructor(private loadingService: LoadingService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['elId'] && !!this.elId)) {
      this.initLoadingSubscription();
    }

    if (changes['control'] || changes['canEdit'] || changes['options']) {
      this.changeControlEnabled();
    }
  }

  ngOnDestroy(): void {
    us.unsub(this.subscriptions);
  }

  initLoadingSubscription(): void {
    us.unsub(this.subscriptions);

    this.subscriptions.push(
      this.loadingService.isLoadingPipeFactory(this.elId).subscribe((isLoading) => {
        this.isLoading = isLoading;

        this.changeControlEnabled();
      })
    );
  }

  changeControlEnabled(): void {
    if (!this.isLoading && us.notEmpty(this.options) && this.canEdit) this.control?.enable();
    else this.control?.disable();
  }

  getErrText(): string {
    const errors = this.control?.errors;

    if (errors == null) return this.errText || 'Invalid field';
    if (errors['required']) return 'This field is required';
    return 'Invalid input';
  }

  get disabled(): boolean {
    return !!this.control?.disabled;
  }
}
