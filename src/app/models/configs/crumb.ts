import { Icons } from "src/app/utils";

export interface Crumb {
  label: string;
  url: string;
  params?: Record<string, string>;
  icon?: Icons;
}
