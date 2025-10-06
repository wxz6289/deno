/**
 * A collection of mathematical functions.
 *
 * @module math
 */

/**
 *
 * @example
 * ```ts
 * import { add } from "./math.ts";
 *
 * const sum = add(2, 3);
 * console.log(sum); // 5
 * ```
 *
 * The function "add" takes two numbers as input and returns their sum.
 * @experimental This function is experimental and may change in future releases.
 * @param {number} a - number
 * @param {number} b - The parameter `b` is a number that is being passed to the `add` function.
 * @returns the sum of the two input numbers, `a` and `b`.
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * Represents a point in 2D space.
 * @example
 * ```ts
 * import { Point } from "./math.ts";
 *
 * const p1 = new Point(0, 0);
 * const p2 = new Point(3, 4);
 * console.log(p1.distance(p2)); // 5
 * ```
 */
export class Point {
  /**
   * Creates a new Point instance.
   * @param {number} x - The x-coordinate of the point.
   * @param {number} y - The y-coordinate of the point.
   */
  constructor(public x: number, public y: number) { }

  /**
   * Calculates the distance between this point and another point.
   * @param {Point} other - The other point to calculate the distance to.
   * @returns The distance between the two points.
   */
  distance(other: Point): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

/**
 * Calculates the sum of an array of numbers.
 * @example
 * ```ts
 * import { sum } from "./math.ts";
 *
 * const total = sum([1, 2, 3, 4, 5]);
 * console.log(total); // 15
 * ```
 * @deprecated This function is deprecated and will be removed in future versions. Please use the `add` function for summing two numbers instead.
 * @param {number[]} arr - An array of numbers to be summed.
 * @returns The sum of all the numbers in the input array.
 */
export function sum(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0);
}