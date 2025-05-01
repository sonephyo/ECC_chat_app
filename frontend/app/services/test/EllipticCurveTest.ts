// To run this file you will have run "npx tsx ./test.ts"
import { EllipticCurve, Point } from "../Ecdh";

// Create the curve instance in two steps to avoid circular dependency
const curveParams = {
  p: BigInt(
    "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F"
  ),
  a: BigInt(0),
  b: BigInt(7),
  n: BigInt(
    "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141"
  ),
  h: 1n,
};

// First create a temporary curve for the generator point
const tempCurve = new EllipticCurve(
  curveParams.p,
  curveParams.a,
  curveParams.b,
  new Point(null, null, null!), // Dummy point
  curveParams.n,
  curveParams.h
);

// Then create the actual generator point
const G = new Point(
  BigInt("0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798"),
  BigInt("0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8"),
  tempCurve
);

// Now create the actual curve with the proper generator point
const secp256k1 = new EllipticCurve(
  curveParams.p,
  curveParams.a,
  curveParams.b,
  G,
  curveParams.n,
  curveParams.h
);

// Finally update the generator point's curve reference
G.curve = secp256k1;

console.log(G)

export { secp256k1 };

// Small test for the class method
// const p = 17n;
// const a = 2n;
// const b = 2n;
// const n = 19n;
// const h = 1n;

// const dummy = new EllipticCurve(p, a, b, new Point(null, null, null!), n, h);
// const G = new Point(5n, 1n, dummy);
// const toyCurve = new EllipticCurve(p, a, b, G, n, h);
// G.curve = toyCurve;

// export { toyCurve };
