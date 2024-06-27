export function mock<T>(func: T) {
  return func as jest.Mock;
}
