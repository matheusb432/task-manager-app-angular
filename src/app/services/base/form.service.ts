import { BehaviorSubject, Observable } from 'rxjs';
import { PaginationOptions, PostReturn, TableItem } from 'src/app/models';
import { Constants } from 'src/app/util';
import { FormApiService } from '../interfaces/form-api-service';
import { ToastService } from '../toast.service';

export abstract class FormService<TEntity extends TableItem> {
  protected _item$ = new BehaviorSubject<TEntity | undefined>(undefined);
  protected _listItems$ = new BehaviorSubject<TEntity[]>([]);
  protected _total$ = new BehaviorSubject(0);
  protected _lastOptions$ = new BehaviorSubject<PaginationOptions>(PaginationOptions.default());

  get item$(): Observable<TEntity | undefined> {
    return this._item$.asObservable();
  }

  get listItems$(): Observable<TEntity[]> {
    return this._listItems$.asObservable();
  }

  get total$(): Observable<number> {
    return this._total$.asObservable();
  }

  get lastOptions$(): Observable<PaginationOptions> {
    return this._lastOptions$.asObservable();
  }

  protected toastMessages = {
    noId: "Couldn't fetch ID!",
    noItem: "Couldn't fetch item!",
    createSuccess: 'Item created successfully!',
    updateSuccess: 'Item updated successfully!',
    updateIdError: "Couldn't update item, couldn't fetch ID!",
    deleteSuccess: 'Item deleted successfully!',
    duplicateSuccess: 'Item duplicated successfully!',
  };

  constructor(protected ts: ToastService, protected api: FormApiService<TEntity>) {}

  async loadListItems(options?: PaginationOptions): Promise<void> {
    if (options == null) {
      options = this._lastOptions$.getValue() ?? PaginationOptions.default();
    } else {
      this._lastOptions$.next(options);
    }

    const res = await this.api.getPaginated(options);

    this._listItems$.next(res.items);
    this._total$.next(res.total);
  }

  async loadItem(id: string | null | undefined): Promise<TEntity | null> {
    if (!id) {
      this.ts.error(this.toastMessages.noId);

      return null;
    }

    const parsedId = +id;
    const item = this._item$.getValue();

    if (item?.id === parsedId) return item;

    const res = await this.api.getById(parsedId);

    this._item$.next(res);

    if (res == null) this.ts.error(this.toastMessages.noItem);

    return res;
  }

  update = async (id: string | null | undefined, item: Partial<TEntity>): Promise<void> => {
    if (id == null) {
      this.ts.error(this.toastMessages.updateIdError);
      return;
    }

    await this.api.update({ ...item, id: +id });

    this.ts.success(this.toastMessages.updateSuccess);

    await this.loadListItems();
  };

  insert = async (item: Partial<TEntity>): Promise<PostReturn> => {
    const res = await this.api.insert(item);

    this.ts.success(this.toastMessages.createSuccess);

    await this.loadListItems();

    return res;
  };

  duplicate = async (item: Partial<TEntity>): Promise<PostReturn> => {
    const res = await this.api.duplicate(item);

    this.ts.success(this.toastMessages.duplicateSuccess);

    await this.loadListItems();

    return res;
  };

  deleteItem = async (id: string | number | null | undefined): Promise<void> => {
    if (!id) {
      this.ts.error(this.toastMessages.noId);

      return;
    }
    const parsedId = +id;

    await this.api.remove(parsedId);
    this.removeFromMemory(parsedId);

    this.ts.success(this.toastMessages.deleteSuccess);
  };

  getItemsPerPage = (): number => {
    return this._lastOptions$.getValue()?.itemsPerPage ?? Constants.DefaultItemsPerPage;
  };

  protected removeFromMemory = (id: number): void => {
    const item = this._item$.getValue();
    if (item?.id === id) this._item$.next(undefined);

    const listItems = this._listItems$.getValue();

    if (!listItems.some((x) => x.id === id)) return;

    const filteredListItems = listItems.filter((x) => x.id !== id);
    this._listItems$.next(filteredListItems);
    this._total$.next(this._total$.getValue() - 1);

    if (filteredListItems.length === 0) {
      this.decrementPage();

      this.loadListItems();
    }
  };

  protected decrementPage = (): void => {
    const lastOptions = this._lastOptions$.getValue();
    if (!lastOptions?.page) return;

    this._lastOptions$.next({ ...lastOptions, page: lastOptions.page - 1 });
  };
}
