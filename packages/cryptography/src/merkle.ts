import CryptoJS from "crypto-js";

export type MerklePathItem = { hash: string; position: "left" | "right" };

function sha256HexConcat(leftHex: string, rightHex: string): string {
  const bytes = CryptoJS.enc.Hex.parse(leftHex + rightHex);
  return CryptoJS.SHA256(bytes).toString(CryptoJS.enc.Hex);
}

function padLeaves(leaves: string[]): string[] {
  if (leaves.length === 0) {
    return [sha256HexConcat("".padStart(64, "0"), "".padStart(64, "0"))];
  }
  return leaves;
}

/**
 * Build a Merkle tree root + proof paths for each leaf index.
 * - If the number of leaves is odd at any level, the last node is duplicated.
 */
export function buildMerkle(leavesIn: string[]): { root: string; proofs: Record<number, MerklePathItem[]> } {
  const leaves = padLeaves(leavesIn.slice());
  const proofs: Record<number, MerklePathItem[]> = {};
  for (let i = 0; i < leaves.length; i++) proofs[i] = [];

  let level = leaves.slice();
  let indexGroups: number[][] = level.map((_, i) => [i]);

  while (level.length > 1) {
    if (level.length % 2 === 1) {
      level.push(level[level.length - 1]);
      indexGroups.push(indexGroups[indexGroups.length - 1]);
    }

    const next: string[] = [];
    const nextGroups: number[][] = [];

    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1];

      next.push(sha256HexConcat(left, right));

      for (const li of indexGroups[i]) proofs[li].push({ hash: right, position: "right" });
      for (const ri of indexGroups[i + 1]) proofs[ri].push({ hash: left, position: "left" });

      nextGroups.push([...indexGroups[i], ...indexGroups[i + 1]]);
    }

    level = next;
    indexGroups = nextGroups;
  }

  return { root: level[0], proofs };
}

/** Verify a Merkle proof (path) for a given leaf hash and expected root. */
export function verifyMerkleProof(leaf: string, path: MerklePathItem[], expectedRoot: string): boolean {
  let acc = leaf;
  for (const p of path) {
    acc = p.position === "left" ? sha256HexConcat(p.hash, acc) : sha256HexConcat(acc, p.hash);
  }
  return acc === expectedRoot;
}
