interface CustomMock extends jest.Mock {
  // biome-ignore lint: Running linting with `unsafe` flag changes import to 'node:util' which breaks the CI. See https://nodejs.org/docs/latest-v18.x/api/util.html
  return: (value: any) => CustomMock;
}

export function mock<T>(func: T) {
  const result = func as CustomMock;
  result.return = (obj: T) => result.mockReturnValue(obj);
  return result;
}
