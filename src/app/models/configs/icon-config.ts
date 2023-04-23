import { ThemePalette } from '@angular/material/core';
import { DetailsTypes, Icons } from 'src/app/utils';

export class IconConfig<T = unknown> {
  private constructor(
    public id: string,
    public icon: Icons,
    public color: ThemePalette,
    public onClick?: (...args: T[]) => void,
    public urlType?: DetailsTypes
  ) {}

  static withUrlType<T = unknown>(
    id: string,
    icon: Icons,
    urlType: DetailsTypes,
    color: ThemePalette = 'primary'
  ): IconConfig<T> {
    return new IconConfig<T>(id, icon, color, undefined, urlType);
  }

  static withClick<T = unknown>(
    id: string,
    icon: Icons,
    onClick: (...args: T[]) => void,
    color: ThemePalette = 'primary'
  ): IconConfig<T> {
    return new IconConfig<T>(id, icon, color, onClick);
  }
}
