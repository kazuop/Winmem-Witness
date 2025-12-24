import { sha256Hex } from "@winmem/cryptography";

export type ArchiveManifest = {
  projectId: string;
  createdAt: string;
  latestRoot?: string;
  pointers: { exports?: string[]; audits?: string[] };
  notes?: string;
};

export function hashArchiveManifest(m: ArchiveManifest): string {
  return sha256Hex(m);
}
