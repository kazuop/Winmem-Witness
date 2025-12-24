# Winmem On-Chain Program (Optional)

This folder contains an optional Solana program that lets Winmem anchor audit checkpoints on-chain.

## What it does

- Creates a `Project` account that defines an authority.
- Allows the authority to post `Root` entries (Merkle roots / snapshot hashes) over time.
- Supports authority rotation.

This program is **not required** to run Winmem off-chain services.
It exists for teams that want an on-chain, publicly verifiable anchor for audit batches.

## Build & test

```bash
cd programs/winmem-anchor
anchor build
anchor test
```

## Design

- `Project` PDA: `["project", authority, project_id]`
- `Root` PDA: `["root", project, index_le]`

Where:
- `project_id` is a user-supplied pubkey that uniquely identifies the project.
- `index` is a monotonically increasing counter in `Project.root_count`.

## Security

- Only the current `Project.authority` can post new roots or rotate authority.
- Roots are immutable once posted.
