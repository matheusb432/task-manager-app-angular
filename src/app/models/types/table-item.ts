export abstract class TableItem {
  id?: number;

  static tableHeaders: () => string[];
  static tableKeys: () => (keyof unknown)[];
}
