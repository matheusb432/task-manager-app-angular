import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, map, takeUntil } from 'rxjs';
import { PaginationOptions, Role, User, UserRole } from 'src/app/models';
import { ToastService, AppService } from 'src/app/services';
import { FormService } from 'src/app/services/base/form.service';
import { PubSubUtil } from 'src/app/util';
import { DetailsTypes, paths } from 'src/app/util/constants/pages';
import { UserApiService } from './user-api.service';
import { UserFormValue, UserFormGroup } from '../components/user-form/user-form-group';

@Injectable({
  providedIn: 'root',
})
export class UserService extends FormService<User> implements OnDestroy {
  private destroyed$ = new Subject<boolean>();
  private _roles$ = new BehaviorSubject<Role[]>([]);

  get roles$() {
    return this._roles$.asObservable();
  }

  constructor(
    protected override api: UserApiService,
    protected override ts: ToastService,
    private app: AppService,
    private router: Router
  ) {
    super(ts, api);
    this.setToastMessages();
    this.initSubs();
  }

  ngOnDestroy(): void {
    PubSubUtil.completeDestroy(this.destroyed$);
  }

  private initSubs() {
    this.app.clearSessionState$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this._item$.next(undefined);
      this._listItems$.next([]);
    });
  }

  loadListData = async (): Promise<void> => {
    await this.loadListItems(PaginationOptions.default());
  };

  loadCreateData = async () => {
    await this.loadRoles();
  };

  loadEditData = async (id: string | null | undefined): Promise<User | null> => {
    await this.loadRoles();
    return this.loadItem(id);
  };

  loadRoles = async () => {
    const roles = await this.api.getRoles();
    this._roles$.next(roles);
  };

  convertToFormValue(item: User): Partial<UserFormValue> {
    const value: Partial<UserFormValue> = {
      signup: {
        name: item.name ?? '',
        userName: item.userName ?? '',
        email: item.email ?? '',
        password: '',
        confirmPassword: '',
      },
    };

    return value;
  }

  toJson(fg: UserFormGroup): User {
    const value = UserFormGroup.toJson(fg);

    return {
      ...value.signup,
    };
  }

  goToList = () => this.router.navigateByUrl(paths.users);
  goToCreate = () => this.router.navigateByUrl(paths.usersCreate);
  goToDetails = async (id: number, type: DetailsTypes) => {
    this.router.navigate([paths.usersDetails], { queryParams: { id, type } });
  };

  private setToastMessages = () => {
    this.toastMessages = {
      ...this.toastMessages,
      noItem: "Couldn't fetch user!",
      createSuccess: 'User created successfully!',
      updateSuccess: 'User updated successfully!',
      updateIdError: "Couldn't update user, couldn't fetch ID!",
      deleteSuccess: 'User deleted successfully!',
    };
  };
}
