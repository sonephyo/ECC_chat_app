class Point{
    constructor(x,y, curve){
        this.x = x
        this.y = y
        this.curve = curve
        if (!this.isInfinity() && !curve.isOnCurve(this)){
            throw new Error("point no on curve")
        }
    }
    
    isInfinity(){
        return this.x === null && this.y ===null;
    }
    equal(other){
        if(this.isInfinity() && other.isInfinity()) return true;
        return this.x === other.x && this.y === other.y && this.curve === other.curve;
    }
}
class EllitpticCurve {
    constructor(p,a,b,G,n, h=1) {
        this.p = p;
        this.a = a;
        this.b = b;
        this.G = G;
        this.n = n;
        this.h = h;
    }
    isOnCurve(point){
        if(point.isInfinity()) return true;
        const left = (point.y ** 2n) % this.p
        const right = (point.x**3n + this.a*point.x+ this.b) % this.p
        return left === right;
    }
    pointAdd(P, Q){
        if(P.isInfinity()) return Q;
        if(Q.isInfinity()) return P;
        if(Q.x=== P.x && Q.y !== P.y)
            return new Point(null,null, this);

        if (P.equal(Q)){
            return this.pointDouble(P)
        }
        
        const numerator = (Q.y - P.y) % this.p
        const denominator = (Q.x- P.x) % this.p
        const inv_denominator = this.modInverse(denominator,this.p)
        const m  = (numerator* inv_denominator) % this.p

        const xR = (m * m - P.x - Q.x) % this.p;
        const yR = (m * (P.x - xR) - P.y) % this.p;

        return new Point(xR, yR, this);
    
    }

    pointDouble(P) {
        if (P.isInfinity()) return P;
        if (P.y === 0n) return new Point(null, null, this);
    
        const numerator = (3n * P.x ** 2n + this.a) % this.p;
        const denominator = (2n * P.y) % this.p;
        const invDenominator = this.modInverse(denominator, this.p);
        const m = (numerator * invDenominator) % this.p;
    
        const xR = (m * m - 2n * P.x) % this.p;
        const yR = (m * (P.x - xR) - P.y) % this.p;
    
        return new Point(xR, yR, this);
    }
    
    scalarMult(k, P) {
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
    
    generateKeyPair() {
        // In Node.js, use crypto.randomBytes(32)
        const privateKey = BigInt('0x' + crypto.randomBytes(32).toString('hex')) % this.n;
        const publicKey = this.scalarMult(privateKey, this.G);
    
        return { privateKey, publicKey };
    }
    modInverse(a, m) {
        let [oldR, r] = [a, m];
        let [oldS, s] = [1n, 0n];
    
        while (r !== 0n) {
          const quotient = oldR / r;
          [oldR, r] = [r, oldR - quotient * r];
          [oldS, s] = [s, oldS - quotient * s];
        }
    
        if (oldR !== 1n) throw new Error('No modular inverse exists');
        return oldS < 0n ? oldS + m : oldS;
      }
}