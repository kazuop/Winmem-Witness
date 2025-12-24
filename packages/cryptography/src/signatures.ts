/**
 * Optional signing primitive for anchoring manifests externally.
 * This package intentionally avoids opinionated KMS code.
 */
import crypto from "node:crypto";

export type KeyPair = { publicKeyPem: string; privateKeyPem: string };

export function generateEd25519KeyPair(): KeyPair {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
  return {
    publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString(),
    privateKeyPem: privateKey.export({ type: "pkcs8", format: "pem" }).toString()
  };
}

export function signEd25519(message: Uint8Array, privateKeyPem: string): Uint8Array {
  const key = crypto.createPrivateKey(privateKeyPem);
  return crypto.sign(null, Buffer.from(message), key);
}

export function verifyEd25519(message: Uint8Array, signature: Uint8Array, publicKeyPem: string): boolean {
  const key = crypto.createPublicKey(publicKeyPem);
  return crypto.verify(null, Buffer.from(message), key, Buffer.from(signature));
}
