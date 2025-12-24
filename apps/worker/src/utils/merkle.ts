import CryptoJS from "crypto-js";
export type MerklePathItem = { hash: string; position: "left" | "right" };
function sha256HexConcat(leftHex: string, rightHex: string): string {
  const bytes = CryptoJS.enc.Hex.parse(leftHex + rightHex);
  return CryptoJS.SHA256(bytes).toString(CryptoJS.enc.Hex);
}
export function buildMerkle(leaves: string[]): { root: string; proofs: Record<number, MerklePathItem[]> } {
  if (leaves.length === 0) return { root: sha256HexConcat("".padStart(64,"0"), "".padStart(64,"0")), proofs: {} };
  let level = leaves.slice();
  const proofs: Record<number, MerklePathItem[]> = {};
  for (let i=0;i<leaves.length;i++) proofs[i]=[];
  let idxMap = level.map((_,i)=>[i]);
  while (level.length>1) {
    if (level.length%2===1){ level.push(level[level.length-1]); idxMap.push(idxMap[idxMap.length-1]); }
    const next: string[]=[]; const nextIdx: number[][]=[];
    for (let i=0;i<level.length;i+=2){
      const left=level[i], right=level[i+1];
      next.push(sha256HexConcat(left,right));
      for (const li of idxMap[i]) proofs[li].push({hash:right, position:"right"});
      for (const ri of idxMap[i+1]) proofs[ri].push({hash:left, position:"left"});
      nextIdx.push([...idxMap[i], ...idxMap[i+1]]);
    }
    level=next; idxMap=nextIdx;
  }
  return { root: level[0], proofs };
}
