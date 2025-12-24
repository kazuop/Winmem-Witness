import * as anchor from "@coral-xyz/anchor";
import { expect } from "chai";
import { PublicKey, Keypair } from "@solana/web3.js";

describe("winmem", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Winmem as anchor.Program;

  it("initializes project and posts root", async () => {
    const authority = provider.wallet as anchor.Wallet;
    const projectId = Keypair.generate().publicKey;

    const [projectPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("project"), authority.publicKey.toBuffer(), projectId.toBuffer()],
      program.programId
    );

    await program.methods
      .initProject(projectId, "winmem-demo")
      .accounts({
        authority: authority.publicKey,
        project: projectPda,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc();

    const project = await program.account.project.fetch(projectPda);
    expect(project.authority.toBase58()).to.eq(authority.publicKey.toBase58());
    expect(project.rootCount.toNumber()).to.eq(0);

    const rootDigest = new Uint8Array(32);
    rootDigest[0] = 7;

    const [rootPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("root"), projectPda.toBuffer(), Buffer.from(new anchor.BN(0).toArray("le", 8))],
      program.programId
    );

    await program.methods
      .postRoot(Array.from(rootDigest) as any)
      .accounts({
        authority: authority.publicKey,
        project: projectPda,
        rootAccount: rootPda,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc();

    const root = await program.account.root.fetch(rootPda);
    expect(root.index.toNumber()).to.eq(0);
    expect(Buffer.from(root.root).equals(Buffer.from(rootDigest))).to.eq(true);

    const project2 = await program.account.project.fetch(projectPda);
    expect(project2.rootCount.toNumber()).to.eq(1);
  });

  it("rotates authority", async () => {
    const authority = provider.wallet as anchor.Wallet;
    const projectId = Keypair.generate().publicKey;

    const [projectPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("project"), authority.publicKey.toBuffer(), projectId.toBuffer()],
      program.programId
    );

    await program.methods
      .initProject(projectId, "rotate-demo")
      .accounts({
        authority: authority.publicKey,
        project: projectPda,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc();

    const newAuthority = Keypair.generate().publicKey;

    await program.methods
      .rotateAuth(newAuthority)
      .accounts({
        authority: authority.publicKey,
        project: projectPda
      })
      .rpc();

    const p = await program.account.project.fetch(projectPda);
    expect(p.authority.toBase58()).to.eq(newAuthority.toBase58());
  });
});
