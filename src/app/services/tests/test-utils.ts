function assertObjectsAreEqual<T>(actual: T, expected: T): void {
  expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
}

export { assertObjectsAreEqual};
