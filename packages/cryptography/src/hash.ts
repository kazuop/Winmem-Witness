import CryptoJS from "crypto-js";
import { canonicalize } from "./canonical-json.js";

/** SHA-256 of canonical JSON, returned as lowercase hex. */
export function sha256Hex(obj: unknown): string {
  return CryptoJS.SHA256(canonicalize(obj)).toString(CryptoJS.enc.Hex);
}

/** SHA-256 of raw bytes, returned as lowercase hex. */
export function sha256HexBytes(bytes: Uint8Array): string {
  const w = CryptoJS.lib.WordArray.create(bytes as any);
  return CryptoJS.SHA256(w).toString(CryptoJS.enc.Hex);
}
