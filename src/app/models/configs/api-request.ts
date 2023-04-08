export class ApiRequest<T> {
  itemType?: Ctor<T>;
  postDto?: Ctor<any>;
  putDto?: Ctor<any>;
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

  static post<T>(url: string, item: T, postDto: Ctor<any>): ApiRequest<T> {
    return { url, item, postDto };
  }

  static put<T>(url: string, id: number, item: T, putDto: Ctor<any>): ApiRequest<T> {
    return { url, id, item, putDto };
  }

  static delete<T>(url: string, id: number): ApiRequest<T> {
    return { url, id };
  }
}

export type ResCallback = (...args: any[]) => any;

export type Ctor<T> = new (...args: any[]) => T;
