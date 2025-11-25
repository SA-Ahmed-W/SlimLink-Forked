/**
 * Default URL-safe alphabet (same as nanoid)
 */
const URL_SAFE_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";

export interface IDGeneratorOptions {
  /**
   * Character set to use. If omitted, uses URL-friendly alphabet.
   */
  alphabet?: string;
  /**
   * Default length for generated IDs. Must be an integer >= 1.
   * Default: 6
   */
  length?: number;
}

/**
 * Generate a cryptographically secure random string from a given alphabet.
 * Uses rejection sampling to ensure uniform distribution.
 */
function generateSecureString(alphabet: string, length: number): string {
  const mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1;
  const step = -~((1.6 * mask * length) / alphabet.length);

  let id = "";

  while (true) {
    const bytes = new Uint8Array(step);
    crypto.getRandomValues(bytes);

    for (let i = 0; i < step; i++) {
      const byte = bytes[i] & mask;
      if (alphabet[byte]) {
        id += alphabet[byte];
        if (id.length === length) return id;
      }
    }
  }
}

/**
 * ID generator using crypto.getRandomValues for secure randomness.
 *
 * - Default length: 6
 * - Default alphabet: URL-safe (0-9, A-Z, a-z, _, -)
 * - Uses rejection sampling for uniform distribution
 */
class IDGenerator {
  private alphabet: string;
  private length: number;

  constructor(options: IDGeneratorOptions = {}) {
    const len = options.length ?? 6;
    this.assertValidLength(len);
    this.length = len;

    if (options.alphabet) {
      this.assertValidAlphabet(options.alphabet);
      this.alphabet = options.alphabet;
    } else {
      this.alphabet = URL_SAFE_ALPHABET;
    }
  }

  private assertValidLength(n: number) {
    if (!Number.isInteger(n) || n < 1) {
      throw new TypeError("length must be an integer >= 1");
    }
  }

  private assertValidAlphabet(a: string) {
    if (typeof a !== "string" || a.length < 2) {
      throw new TypeError(
        "alphabet must be a string with at least 2 characters"
      );
    }
    // prevent extremely large alphabets (practical sanity limit)
    if (a.length > 1024) {
      throw new TypeError("alphabet is too large");
    }
  }

  /**
   * Generate an ID using the configured alphabet/length.
   * You can override length for a single call.
   */
  generate(length?: number): string {
    const len = length ?? this.length;
    this.assertValidLength(len);
    return generateSecureString(this.alphabet, len);
  }

  /**
   * Create a new IDGenerator preconfigured for numeric-only IDs.
   * Example: IDGenerator.numeric(6)
   */
  static numeric(length = 6) {
    return new IDGenerator({ alphabet: "0123456789", length });
  }

  /**
   * Create a new IDGenerator preconfigured for alphanumeric (upper+lower+digits).
   */
  static alphaNumeric(length = 6) {
    return new IDGenerator({
      alphabet:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      length,
    });
  }

  /**
   * Create a new IDGenerator using URL-safe alphabet.
   */
  static urlSafe(length = 6) {
    return new IDGenerator({ length });
  }

  /**
   * Update default length for this generator instance.
   */
  setDefaultLength(length: number) {
    this.assertValidLength(length);
    this.length = length;
  }

  /**
   * Update alphabet for this generator instance.
   * Pass undefined to revert to URL-safe default alphabet.
   */
  setAlphabet(alphabet?: string) {
    if (alphabet !== undefined) {
      this.assertValidAlphabet(alphabet);
      this.alphabet = alphabet;
    } else {
      this.alphabet = URL_SAFE_ALPHABET;
    }
  }
}

const gen = IDGenerator.urlSafe();

export default gen;

export { IDGenerator };
