# winmem-anchor (Anchor Workspace)

This Anchor workspace provides an optional Winmem program that anchors audit checkpoints on-chain.

## Why optional?

Winmem works fully off-chain. This program is only needed if you want:
- immutable public anchoring of audit batch roots
- simple on-chain authority control
- a canonical place to verify historical roots

## PDA design (recommended)

**Important note:** if you include `authority` in PDA seeds, authority rotation becomes awkward because the PDA address derivation changes.

This repo intentionally keeps `authority` in seeds for **project creation** and **root posting** examples, but rotation is implemented by updating the `Project.authority` field directly.

If you want a strictly seed-validated, rotation-friendly design, use:
- Project PDA seeds: `["project", project_id]`
- Root PDA seeds: `["root", project, index_le]`

You can adapt the accounts constraints accordingly.

## Commands

```bash
anchor build
anchor test
```

## Instructions

- `init_project(project_id, name)`
- `post_root(root_32bytes)`
- `rotate_auth(new_authority)`
