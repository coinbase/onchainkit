type GetErrorMessageParams = {
  cause?: string;
  name?: string;
  message?: string;
  shortMessage?: string;
};

export function getErrorMessage({
  cause,
  name,
  message,
  shortMessage,
}: GetErrorMessageParams): string {
  if (cause === 'UserRejectedRequestError') {
    return 'User rejected request';
  }
  if (name === 'AbiFunctionNotFoundError') {
    return shortMessage || 'ABI function not found';
  }
  if (shortMessage) {
    return shortMessage;
  }
  if (name) {
    return `Something went wrong: ${name}`;
  }
  if (message) {
    return message;
  }
  return 'Something went wrong.';
}
