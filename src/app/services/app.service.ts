import { Injectable } from '@angular/core';
import { AppRequestData, RequestData } from 'src/app/models';
import { us } from '../helpers';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private _reqDict = new Map<string, AppRequestData>();

  registerRequestData = (url: string, customData: RequestData | undefined): void => {
    if (customData == null) return;

    const loadings = customData.loadings;
    const resKey = `${url}|${us.randomHex()}`;

    this.addRequestData(resKey, { url, loadings, moment: Date.now() });
  };

  private addRequestData(key: string, value: AppRequestData): void {
    this._reqDict.set(key, value);
  }

  getRequestData(key: string): AppRequestData | undefined {
    return this._reqDict.get(key);
  }

  getManyByUrl(url: string): [string, AppRequestData][] {
    const result: [string, AppRequestData][] = [];

    for (const entry of this._reqDict.entries()) {
      const valueUrl = entry[1]?.url;
      if (!valueUrl || url !== valueUrl) continue;
      result.push(entry);
    }

    return result;
  }

  removeRequestData(key: string): boolean {
    return this._reqDict.delete(key);
  }

  static sortByMostRecent(datas: [string, AppRequestData][]): void {
    datas.sort((a, b) => b[1].moment - a[1].moment);
  }
}
