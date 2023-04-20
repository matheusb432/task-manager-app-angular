import { ThemePalette } from "@angular/material/core";
import { Icons } from "src/app/utils";

export class IconConfig<T = unknown> {
  constructor(
    public icon: Icons,
    public onClick?: (...args: T[]) => void,
    public color: ThemePalette = 'primary'
  ) {}
}
