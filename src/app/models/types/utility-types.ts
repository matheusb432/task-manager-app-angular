export type Nullish = null | undefined;

export type AsNonNullable<T> = {
  [TKey in keyof T]: NonNullable<T[TKey]>;
};
