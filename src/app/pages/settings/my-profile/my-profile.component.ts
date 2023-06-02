import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PageLayoutComponent } from 'src/app/shared/components/layouts/page-layout/page-layout.component';
import { FormTypes } from 'src/app/util';
import { getUserForm, UserFormGroup } from '../../user/components/user-form/user-form-group';
import { MyProfileFormComponent } from '../components/my-profile-form/my-profile-form.component';
import { SettingsService } from '../services/settings.service';
import {
  getMyProfileForm,
  MyProfileFormGroup,
} from '../components/my-profile-form/my-profile-form-group';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { AuthService } from 'src/app/services';
import { UserAuthGet } from 'src/app/models';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PageLayoutComponent, MyProfileFormComponent, TitleComponent],
})
export class MyProfileComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  private service = inject(SettingsService);
  private authService = inject(AuthService);
  private cdRef = inject(ChangeDetectorRef);
  private destroyed$ = new Subject<boolean>();

  loggedUser$ = this.authService.loggedUser$;

  form!: MyProfileFormGroup;

  FormTypes = FormTypes;

  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.runInitMethods();
  }

  runInitMethods(): void {
    this.initForm();
    this.initSubs();

    // this.loadData();
  }

  initSubs(): void {
    this.loggedUser$.pipe(takeUntil(this.destroyed$)).subscribe((user) => {
      this.initForm(user ?? undefined);
      // if (user == null) {
      //   this.service.goToLogin();
      // }
    });
  }

  // TODO implement
  // async loadData(): Promise<void> {
  //   const loadedItem = await this.service.loadEditData(this.pageData?.id);

  //   if (loadedItem == null) {
  //     this.service.goToList();
  //     return;
  //   }

  //   if (this.form == null) {
  //     this.form = UserFormGroup.from(getUserCreateForm());
  //   }
  //   this.form.patchValue(this.service.convertToFormValue(loadedItem));
  //   this.form.markAllAsTouched();
  //   this.cdRef.detectChanges();
  // }

  initForm(loggedUser?: UserAuthGet): void {
    if (this.form == null) {
      this.form = MyProfileFormGroup.from(getMyProfileForm());
    }
    console.log(loggedUser);
    this.form.patchValue(loggedUser ?? {});
  }

  submitForm(): Promise<void> {
    return this.editItem();
  }

  async editItem(): Promise<void> {
    const value = MyProfileFormGroup.toJson(this.form);
    console.warn('my-profile.component', value);
    return this.service.updateMyProfile(value);
    // await this.service.update(this.pageData?.id, {
    //   ...value,
    //   userRoles: value.roleIds?.map((x) => ({
    //     roleId: x,
    //   })),
    // });
  }

  onCancel(): Promise<boolean> {
    return this.service.goToIndex();
  }
}
