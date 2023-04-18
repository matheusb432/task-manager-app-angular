export abstract class Entity {
  id?: number;

  static tableHeaders: () => string[];
  static tableKeys: () => (keyof unknown)[];
}
