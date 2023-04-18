import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { us } from 'src/app/helpers';
import { SelectOption } from 'src/app/models/configs';
import { ProfileType } from 'src/app/models/entities/profile-type';
import { ProfileTypeService } from 'src/app/services/profile-type.service';
import { ProfileService } from 'src/app/services/profile.service';
import { FormTypes } from 'src/app/utils';
import { ProfileFormGroup } from '../profile-form-group';

@Component({
  selector: 'app-profile-form [form] [formType] [cancel]',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnInit, OnDestroy {
  @Input() form!: ProfileFormGroup;
  @Input() formType!: FormTypes;

  // @Input() submit?: (e: any) => any;
  // @Input() cancel!: () => any;
  // @Input() remove?: () => any;

  @Output() save = new EventEmitter<ProfileFormGroup>();
  @Output() cancel = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  get name(): AbstractControl | null {
    return this.form.get('name');
  }

  get timeTarget(): AbstractControl | null {
    return this.form.get('timeTarget');
  }

  get tasksTarget(): AbstractControl | null {
    return this.form.get('tasksTarget');
  }

  get priority(): AbstractControl | null {
    return this.form.get('priority');
  }

  get profileTypeId(): AbstractControl | null {
    return this.form.get('profileTypeId');
  }

  typeOptions: SelectOption[] = [];

  subscriptions: Subscription[] = [];

  get types(): ProfileType[] {
    return this.service.types;
  }

  constructor(private service: ProfileService) {}

  ngOnInit(): void {
    this.initSubs();
  }

  ngOnDestroy(): void {
    us.unsub(this.subscriptions);
  }

  initSubs(): void {
    // TODO better way to handle this?
    this.subscriptions.push(
      this.service.typesSet$.subscribe(() => {
        this.typeOptions = ProfileTypeService.toOptions(this.types);
      })
    );
  }

  showDelete(): boolean {
    return us.isEditForm(this.formType);
  }

  showSubmit(): boolean {
    return !us.isViewForm(this.formType);
  }
}
