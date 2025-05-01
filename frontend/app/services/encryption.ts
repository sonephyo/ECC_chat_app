import { createHash } from "crypto";
import { Point } from "./Ecdh";
import { secp256k1 } from "./test/EllipticCurveTest";

class ChatCrypto {
  private privateKey?: bigint;
  public publicKey?: Point;
  private shareSecret?: bigint;

  initialize() {
    const { privateKey, publicKey } = secp256k1.generateKeyPair();
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  establishSession(peerPublicKey: { x: string; y: string }) {
    if (!this.privateKey) throw new Error("Not initialized");

    const PeerPoint = new Point(
      BigInt(peerPublicKey.x),
      BigInt(peerPublicKey.y),
      secp256k1
    );

    const sharePoint = secp256k1.scalarMult(this.privateKey, PeerPoint);

    if (sharePoint.x == null) {
      throw new Error("Unable to establish share secret");
    }
    this.shareSecret = sharePoint.x;
  }

  deriveAesKeyFromBigInt(secret: bigint): Uint8Array {
    const hex = secret.toString(16).padStart(64, "0");
    const raw = Buffer.from(hex, "hex");
    const hashed = createHash("sha256").update(raw).digest();
    return new Uint8Array(hashed);
  }
  
  async encrypt(message: string): Promise<string> {
    if (!this.shareSecret) throw new Error("No session established");

    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const secretBytes = this.deriveAesKeyFromBigInt(this.shareSecret);

    const key = await crypto.subtle.importKey(
      "raw",
      secretBytes,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    return JSON.stringify({
      iv: Array.from(iv)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
      data: Array.from(new Uint8Array(ciphertext))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    });
  }

  async decrypt(encrypted: string): Promise<string> {
    if (!this.shareSecret) throw new Error("No seesion established");

    const { iv, data } = JSON.parse(encrypted);
    const secretBytes = this.deriveAesKeyFromBigInt(this.shareSecret);
    console.log(iv);
    console.log(data);

    const key = await crypto.subtle.importKey(
      "raw",
      secretBytes,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(
          iv.match(/.{2}/g)!.map((b: string) => parseInt(b, 16))
        ),
      },
      key,
      new Uint8Array(data.match(/.{2}/g)!.map((b: string) => parseInt(b, 16)))
    );

    return new TextDecoder().decode(decrypted);
  }

  getPublicKeyPayLoad() {
    if (!this.publicKey) throw new Error("Not initialized");
    return {
      x: this.publicKey.x!.toString(),
      y: this.publicKey.y!.toString(),
    };
  }

  getSharedSecret() {
    if (!this.getSharedSecret)
      throw new Error("Session has not been established yet");
    return this.shareSecret;
  }
}

export { ChatCrypto };
