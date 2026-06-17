/**
 * Custom error for invalid color reference strings in design tokens.
 * Includes the problematic colorRef and an optional cause.
 *
 * @class ColorTokenParsingError
 * @extends Error
 * @property {string} colorRef - The invalid color reference string that caused the error.
 * @constructor
 * @param {string} colorRef - The invalid color reference string.
 * @param {Error} [cause] - Optional underlying error cause for additional context.
 *
 * @example
 * ```ts
 * try {
 *   colorRefToCssVar("invalid.color.ref");
 * } catch (error) {
 *   if (error instanceof ColorTokenParsingError) {
 *     console.error(error.message); // "Invalid color reference: invalid.color.ref"
 *     console.error(error.colorRef); // "invalid.color.ref"
 *     console.error(error.cause); // Original error with parsing details
 *   }
 * }
 * ```
 */
class ColorTokenParsingError extends Error {
  /**
   * The invalid color reference string that caused the error.
   */
  public readonly colorRef: string;

  /**
   * Constructs a new ColorTokenParsingError.
   * @param colorRef - The invalid color reference string.
   * @param cause - Optional underlying error cause.
   */
  constructor(colorRef: string, cause?: Error) {
    super(`Invalid color reference: ${colorRef}`, { cause });
    this.name = 'ColorTokenParsingError';
    this.colorRef = colorRef;
  }
}

export { ColorTokenParsingError };
