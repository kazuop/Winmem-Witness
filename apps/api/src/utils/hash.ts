import CryptoJS from "crypto-js";
import { canonicalize } from "./canonicalJson.js";
export function sha256Hex(obj: unknown): string {
  return CryptoJS.SHA256(canonicalize(obj)).toString(CryptoJS.enc.Hex);
}
