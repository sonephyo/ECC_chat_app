// import { secp256k1 } from "./EllipticCurveTest";

import { ChatCrypto } from "../encryption";
// import { toyCurve } from "./EllipticCurveTest";

// const {privateKey: a, publicKey: A} = secp256k1.generateKeyPair()
// const {privateKey: b, publicKey: B} = secp256k1.generateKeyPair()

// console.log(A, a)
// console.log(B, b)

// const {privateKey: a, publicKey: A} = toyCurve.generateKeyPair()
// const {privateKey: b, publicKey: B} = toyCurve.generateKeyPair()
// console.log("chebbb!!!!!!!!!!")
// console.log(a, A)
// console.log(b, B)

// const sharedA = toyCurve.scalarMult(a, B)
// const sharedB = toyCurve.scalarMult(b, A)

// console.log("Shared keys")
// console.log("Generated Shared key from A", sharedA)
// console.log("Generated Shared key from B", sharedB)

const chatCryptoInstanceA = new ChatCrypto();
const chatCryptoInstanceB = new ChatCrypto();
chatCryptoInstanceA.initialize();
chatCryptoInstanceB.initialize();

chatCryptoInstanceA.establishSession(chatCryptoInstanceB.getPublicKeyPayLoad());
chatCryptoInstanceB.establishSession(chatCryptoInstanceA.getPublicKeyPayLoad());

console.log(chatCryptoInstanceA.getSharedSecret());
console.log(chatCryptoInstanceB.getSharedSecret());

const secret1 = chatCryptoInstanceA.getSharedSecret();
const secret2 = chatCryptoInstanceB.getSharedSecret();

console.log(secret1 === secret2);

const message = "Hello World, are you listening to me"
const ciphertext = await chatCryptoInstanceA.encrypt(message)
console.log("CipherText: ", ciphertext)
const decryptedtext = await chatCryptoInstanceB.decrypt(ciphertext)
console.log("decryptedText: ", decryptedtext)

