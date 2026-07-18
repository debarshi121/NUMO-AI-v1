/**
 * Core Pythagorean/Vedic numerology primitives.
 *
 * Every derived number in this app — Birth Number, Destiny Number, Vehicle
 * Numerology Number, plate "running" totals, purchase-date vibrations — is
 * ultimately produced by the same building block: digital root reduction.
 * The functions below implement that primitive once and reuse it everywhere,
 * so a single trusted routine backs every numerology calculation in the app.
 */

/**
 * Reduces a number to a single digit (1-9) via repeated digital-root summation.
 *
 * Digital root algorithm: split the number into its decimal digits, sum them,
 * and repeat until only one digit remains. For example, 1994 -> 1+9+9+4 = 23
 * -> 2+3 = 5. This is the "master reduction" step used throughout numerology
 * to collapse any multi-digit total (a birthdate sum, a plate number, etc.)
 * down to its single-digit root vibration.
 *
 * Note: this implementation does not special-case the numerology "master
 * numbers" (11, 22, 33) — they are reduced the same as any other value, since
 * the vehicle-numerology domain this app models works purely with the 1-9
 * root numbers.
 *
 * @param n - A non-negative integer to reduce.
 * @returns The single-digit (1-9) digital root of `n`.
 */
export function reduceDigits(n: number): number {
  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((digitSum, digit) => digitSum + Number(digit), 0);
  }
  return n;
}

/**
 * Calculates the Birth Number (a.k.a. Mulank / driver number).
 *
 * Algorithm: take only the day-of-month of the date of birth and reduce it to
 * a single digit via {@link reduceDigits}. E.g. born on the 27th -> 2+7 = 9.
 * The Birth Number represents a person's innate, surface-level personality —
 * it is the fastest-changing and most immediately expressed of the two core
 * numbers this app works with (the other being the Destiny Number).
 *
 * @param dob - The person's date of birth.
 * @returns The single-digit (1-9) Birth Number.
 */
export function calculateBirthNumber(dob: Date): number {
  const dayOfMonth = dob.getDate();
  return reduceDigits(dayOfMonth);
}

/**
 * Calculates the Destiny Number (a.k.a. Bhagyank / life-path number).
 *
 * Algorithm: sum every individual digit across the *entire* date of birth
 * (day, month, and full year each contribute their own digits), then reduce
 * that total to a single digit via {@link reduceDigits}. E.g. 15-03-1994
 * concatenates to the digits of "15", "3", "1994" -> 1+5+3+1+9+9+4 = 32 ->
 * 3+2 = 5. Unlike the Birth Number, the Destiny Number reflects a person's
 * long-term life path and is treated as the more heavily weighted of the two
 * numbers throughout this app's compatibility scoring.
 *
 * @param dob - The person's date of birth.
 * @returns The single-digit (1-9) Destiny Number.
 */
export function calculateDestinyNumber(dob: Date): number {
  const day = dob.getDate();
  const month = dob.getMonth() + 1;
  const year = dob.getFullYear();

  const allDateDigitsSum = `${day}${month}${year}`
    .split("")
    .reduce((digitSum, digit) => digitSum + Number(digit), 0);

  return reduceDigits(allDateDigitsSum);
}

/**
 * Calculates a vehicle's numerology number from its registration plate.
 *
 * Algorithm: strip every non-digit character from the plate (state codes and
 * letters carry no numerological weight in this model), keep only the last
 * four digits — the portion of an Indian registration plate that is unique
 * to the individual vehicle — sum those four digits, and reduce the sum to a
 * single digit via {@link reduceDigits}. E.g. plate "AS01GP7597" -> digits
 * "01" + "7597" -> last four "7597" -> 7+5+9+7 = 28 -> 2+8 = 10 -> 1+0 = 1.
 *
 * @param vehicleRegNumber - The full vehicle registration plate string.
 * @returns The single-digit (1-9) vehicle numerology number.
 */
export function calculateVehicleNumerologyNumber(
  vehicleRegNumber: string,
): number {
  const digitsOnly = vehicleRegNumber.replace(/\D/g, "");
  const lastFourDigits = digitsOnly.slice(-4);

  const lastFourDigitsSum = lastFourDigits
    .split("")
    .reduce((digitSum, digit) => digitSum + Number(digit), 0);

  return reduceDigits(lastFourDigitsSum);
}
