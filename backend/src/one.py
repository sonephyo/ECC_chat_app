import os


class Point: 
    def __init__(self, x,y, curve):
        self.x = x
        self.y = y
        self.curve = curve
        # need to check for validity
        if not self.is_infinity() and not self.is_on_curve(self):
            raise ValueError("Not point on Curve")

    def is_infinity(self):
        return self.x is None and self.y is None



class EllipticCurve:
    def __init__(self,p,a,b,G,n,h=1):
        self.p = p
        self.a = a
        self.b = b
        self.G = G
        self.n = n
        self.h = h

    def is_on_curve(self, point):
        if point.is_infinity():
            return True
        return (point.y**2) % self.p == (point.x**3 + self.a*point.x + self.b ) % self.p

    def point_add(self,P,Q):
        if P.is_infinity():
            return Q
        if Q.is_infinity():
            return P
        if Q.x == P.x and Q.y != P.y :
            return Point(None, None, self)
        
        if P == Q:
            return self.point_double(P)
        
        # regular addition
        numerator = (Q.y-P.y) % self.p
        denominator = (Q.x-P.x) % self.p
        inv_denominator = pow(denominator,-1,self.p)
        m = (numerator * inv_denominator) % self.p

        x_r = (m*m - P.x - Q.x) % self.p

        y_r = (m*(P.x -x_r)- P.y) % self.p

        return Point(x_r,y_r, self)
    
    def point_double(self, P):
        if P.is_infinity():
            return P
        if P.y ==0:
            return Point(None, None, self)
        
        numerator = (3*P.x**2 + self.a) % self.p
        denominator = (2 * P.y) % self.p 
        inv_denominator = pow(denominator,-1,self.p)
        m = (numerator * inv_denominator) % self.p

        x_r = (m*m - 2* P.x) % self.p
        y_r = (m*(P.x-x_r)-P.y) % self.p

        return Point(x_r,y_r, self)
        
    def scalar_mult(self, k, P):
        result = Point(None, None, self)
        current = P

        while k > 0:
            if k % 2 == 1:
                result = self.point_add(result,current)
            current = self.point_double(current)
            k = k // 2
        return result
    
    def generate_keypair(self):
        private_key = int.from_bytes(os.urandom(32),"big") % self.n
        public_key = self.scalar_mult(private_key,self.G)

        return public_key
    
    