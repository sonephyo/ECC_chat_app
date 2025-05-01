// src/lib/ecc.ts
import { randomBytes } from "crypto";
// First declare the interface to break circular dependency
interface IEllipticCurve {
  p: bigint;
  a: bigint;
  b: bigint;
  isOnCurve(point: Point): boolean;
  pointAdd(P: Point, Q: Point): Point;
  pointDouble(P: Point): Point;
}

class Point {
  x: bigint | null;
  y: bigint | null;
  curve: IEllipticCurve;

  constructor(x: bigint | null, y: bigint | null, curve: IEllipticCurve) {
    this.x = x;
    this.y = y;
    this.curve = curve;
    if (!this.isInfinity() && !curve.isOnCurve(this)) {
      throw new Error("Point not on curve");
    }
  }

  isInfinity(): boolean {
    return this.x === null && this.y === null;
  }

  equals(other: Point): boolean {
    if (this.isInfinity() && other.isInfinity()) return true;
    return (
      this.x === other.x && this.y === other.y && this.curve === other.curve
    );
  }
}

class EllipticCurve implements IEllipticCurve {
  p: bigint;
  a: bigint;
  b: bigint;
  G: Point;
  n: bigint;
  h: bigint;

  constructor(
    p: bigint,
    a: bigint,
    b: bigint,
    G: Point,
    n: bigint,
    h: bigint = 1n
  ) {
    this.p = p;
    this.a = a;
    this.b = b;
    this.G = G;
    this.n = n;
    this.h = h;
  }

  private mod(a: bigint, m: bigint): bigint {
    return ((a % m) + m) % m;
  }

  isOnCurve(point: Point): boolean {
    if (point.isInfinity()) return true;
    if (point.x === null || point.y === null) return false;

    const left = this.mod(point.y ** 2n, this.p);
    const right = this.mod(point.x ** 3n + this.a * point.x + this.b, this.p);

    return left === right;
  }

  pointAdd(P: Point, Q: Point): Point {
    if (P.isInfinity()) return Q;
    if (Q.isInfinity()) return P;
    if (P.x === null || P.y === null || Q.x === null || Q.y === null) {
      throw new Error("Cannot add infinity points");
    }

    if (Q.x === P.x && Q.y !== P.y) {
      return new Point(null, null, this);
    }

    if (P.equals(Q)) {
      return this.pointDouble(P);
    }

    const numerator = (Q.y - P.y) % this.p;
    const denominator = (Q.x - P.x) % this.p;
    const inv_denominator = this.modInverse(denominator, this.p);
    const m = (numerator * inv_denominator) % this.p;

    const xR = (m * m - P.x - Q.x) % this.p;
    const yR = (m * (P.x - xR) - P.y) % this.p;

    return new Point(xR, yR, this);
  }

  pointDouble(P: Point): Point {
    if (P.isInfinity()) return P;
    if (P.x === null || P.y === null) {
      throw new Error("Cannot double infinity point");
    }

    if (P.y === 0n) return new Point(null, null, this);

    const numerator = (3n * P.x ** 2n + this.a) % this.p;
    const denominator = (2n * P.y) % this.p;
    const invDenominator = this.modInverse(denominator, this.p);
    const m = (numerator * invDenominator) % this.p;

    const xR = (m * m - 2n * P.x) % this.p;
    const yR = (m * (P.x - xR) - P.y) % this.p;

    return new Point(xR, yR, this);
  }

  scalarMult(k: bigint, P: Point): Point {
    let result = new Point(null, null, this);
    let current = P;

    while (k > 0n) {
      if (k % 2n === 1n) {
        result = this.pointAdd(result, current);
      }
      current = this.pointDouble(current);
      k = k / 2n;
    }
    return result;
  }

  generateKeyPair(): { privateKey: bigint; publicKey: Point } {
    // if (typeof window === "undefined") {
    //   throw new Error(
    //     "Web Crypto API is only available in browser environments"
    //   );
    // }

    // const randomBytes = new Uint8Array(32);
    // window.crypto.getRandomValues(randomBytes);
    const generatedRandomBytes = randomBytes(32);

    const hexString = Array.from(generatedRandomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const privateKey = BigInt("0x" + hexString) % this.n;

    const publicKey = this.scalarMult(privateKey, this.G);

    return { privateKey, publicKey };
  }

  private modInverse(a: bigint, m: bigint): bigint {
    a = ((a % m) + m) % m;
    let [oldR, r] = [a, m];
    let [oldS, s] = [1n, 0n];

    while (r !== 0n) {
      const quotient = oldR / r;
      [oldR, r] = [r, oldR - quotient * r];
      [oldS, s] = [s, oldS - quotient * s];
    }

    if (oldR !== 1n) throw new Error("No modular inverse exists");
    return oldS < 0n ? oldS + m : oldS;
  }
}

export { Point, EllipticCurve };
