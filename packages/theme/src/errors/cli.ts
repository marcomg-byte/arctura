/**
 * Error thrown when a CLI argument receives a value that cannot be used.
 *
 * @class InvalidArgumentException
 * @extends Error
 * @property argument - The CLI argument name that received the invalid value.
 * @property value - The invalid value provided for the argument.
 */
class InvalidArgumentException extends Error {
  public readonly argument: string;
  public readonly value: string | undefined;

  /**
   * Constructs a new InvalidArgumentException.
   *
   * @param argument - The CLI argument name that received the invalid value.
   * @param value - The invalid value provided for the argument.
   * @param cause - Optional underlying error cause.
   */
  constructor(argument: string, value: string | undefined, cause?: Error) {
    super(`Invalid value: ${value}, provived to the argument: ${argument}`, { cause });
    this.argument = argument;
    this.value = value;
  }
}

/**
 * Error thrown when a required CLI argument is missing.
 *
 * @class MissingArgumentException
 * @extends Error
 * @property argument - The missing CLI argument name.
 */
class MissingArgumentException extends Error {
  public readonly argument: string;

  /**
   * Constructs a new MissingArgumentException.
   *
   * @param argument - The missing CLI argument name.
   * @param cause - Optional underlying error cause.
   */
  constructor(argument: string, cause?: Error) {
    super(`Missing argument: ${argument}`, { cause });
    this.argument = argument;
  }
}

export { InvalidArgumentException, MissingArgumentException };
