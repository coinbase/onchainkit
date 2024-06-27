export const silenceError = () => {
  const consoleErrorMock = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});
  return () => consoleErrorMock.mockRestore();
};
