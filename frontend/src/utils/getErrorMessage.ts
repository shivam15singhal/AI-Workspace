export function getErrorMessage(error: unknown): string {
  if (
    error instanceof DOMException &&
    error.name === "AbortError"
  ) {
    return "Generation stopped.";
  }

  if (!navigator.onLine) {
    return "No internet connection.";
  }

  if (error instanceof TypeError) {
    return "Unable to connect to the server.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}