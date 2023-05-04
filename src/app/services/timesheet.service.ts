import { Injectable } from '@angular/core';
import { Constants, DetailsTypes, paths } from '../utils';
import { AbstractControl } from '@angular/forms';
import { TimesheetFormGroup } from '../components/timesheet/timesheet-form';
import { PostReturn, Timesheet } from '../models';
import { us } from '../helpers';
import { PaginationOptions } from '../helpers/pagination-options';
import { TimesheetApiService } from './api';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  private item?: Timesheet;

  private _listItems: Timesheet[] = [];
  private _total = 0;

  private _lastOptions?: PaginationOptions;

  get listItems(): Timesheet[] {
    return this._listItems;
  }

  private set listItems(value: Timesheet[]) {
    this._listItems = value;
  }

  get total(): number {
    return this._total;
  }

  private set total(value: number) {
    this._total = value;
  }

  get itemsPerPage(): number {
    return this._lastOptions?.itemsPerPage ?? Constants.DefaultItemsPerPage;
  }

  get currentPage(): number {
    return this._lastOptions?.page ?? 1;
  }

  constructor(
    private api: TimesheetApiService,
    private ts: ToastService,
    private router: Router
  ) {}

  update = async (id: string | null | undefined, fg: TimesheetFormGroup): Promise<void> => {
    if (id == null) {
      this.ts.error("Error while updating Timesheet, couldn't fetch ID!");
      return;
    }

    const item = TimesheetFormGroup.toEntity(fg.value);

    await this.api.update({ id: +id, ...item });

    this.ts.success('Timesheet updated successfully!');

    await this.loadListItems();
  };

  insert = async (fg: TimesheetFormGroup): Promise<PostReturn> => {
    const item = TimesheetFormGroup.toEntity(fg.value);

    const res = await this.api.insert(item);

    this.ts.success('Timesheet created successfully!');

    await this.loadListItems();

    return res;
  };

  duplicate = async (fg: TimesheetFormGroup): Promise<PostReturn> => {
    const item = TimesheetFormGroup.toEntity(fg.value);

    const res = await this.api.duplicate(item);

    this.ts.success('Timesheet duplicated successfully');

    await this.loadListItems();

    return res;
  };

  private removeFromMemory = (id: number): void => {
    if (this.item?.id === id) this.item = undefined;

    if (!this.listItems?.some((x) => x.id === id)) return;

    this.listItems = this.listItems.filter((x) => x.id !== id);
    this.total--;

    if (this.listItems.length === 0) {
      if (this._lastOptions?.page) this._lastOptions.page--;

      this.loadListItems();
    }
  };

  deleteItem = async (id: string | number | null | undefined): Promise<void> => {
    if (!id) {
      this.ts.error("Couldn't fetch ID!");

      return;
    }
    const parsedId = +id;

    await this.api.remove(parsedId);
    this.removeFromMemory(parsedId);

    this.ts.success('Timesheet deleted successfully!');

    this.goToList();
  };

  loadListData = async (): Promise<void> => {
    await this.loadListItems(PaginationOptions.default());
  };

  // TODO implement or remove
  loadCreateData = async () => {
    console.log('...');
  };

  loadEditData = async (id: string | null | undefined): Promise<Timesheet | null> => {
    await this.loadCreateData();
    return this.loadItem(id);
  };

  async loadListItems(options?: PaginationOptions): Promise<void> {
    if (options == null) {
      options = this._lastOptions ?? PaginationOptions.default();
    } else {
      this._lastOptions = options;
    }

    const res = await this.api.getPaginated(options);

    this.total = res.total;
    this.listItems = res.items;
  }

  async loadItem(id: string | null | undefined): Promise<Timesheet | null> {
    if (!id) {
      this.ts.error("Couldn't fetch ID!");

      return null;
    }

    const parsedId = +id;

    if (this.item?.id === parsedId) return us.deepClone(this.item);

    this.item = await this.api.getById(parsedId);

    if (this.item == null) this.ts.error("Couldn't fetch data!");

    return us.deepClone(this.item);
  }

  convertToForm(fg: TimesheetFormGroup, item: Timesheet): void {
    const keys = TimesheetFormGroup.getFormKeys();
    for (const key of keys) {
      const control = fg.get(key) as AbstractControl<unknown>;

      if (control == null) continue;

      control.setValue(item[key] == null ? '' : item[key]);
    }
  }

  goToList = () => this.router.navigateByUrl(paths.timesheets);
  goToCreate = () => this.router.navigateByUrl(paths.timesheetsCreate);
  goToDetails = async (id: number, type: DetailsTypes) => {
    this.router.navigate([paths.timesheetsDetails], { queryParams: { id, type } });
  };}
