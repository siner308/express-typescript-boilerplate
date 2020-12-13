export class ErrorWrapper {
  public message: string;
  public error: Error;

  constructor(message: string, error?: Error) {
    this.message = message;
    if (error) {
      this.error = error;
    }
  }
}
