export class ApiRequest<T = unknown> {
  itemType?: Ctor<T>;
  postDto?: Ctor<unknown>;
  putDto?: Ctor<unknown>;
  item?: T;
  id?: number;
  resCallback?: ResCallback;

  constructor(public url: string) {}

  static getAll<T>(url: string, itemType: Ctor<T>): ApiRequest<T> {
    return { url, itemType };
  }

  static getById<T>(url: string, itemType: Ctor<T>, id: number): ApiRequest<T> {
    return { url, itemType, id };
  }

  static post<T>(url: string, item: T, postDto: Ctor<unknown>): ApiRequest<T> {
    return { url, item, postDto };
  }

  static put<T>(url: string, id: number, item: T, putDto: Ctor<unknown>): ApiRequest<T> {
    return { url, id, item, putDto };
  }

  static delete<T>(url: string, id: number): ApiRequest<T> {
    return { url, id };
  }
}

export type ResCallback = (...args: unknown[]) => unknown;

export type Ctor<T> = new (...args: unknown[]) => T;
