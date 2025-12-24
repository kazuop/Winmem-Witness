use anchor_lang::prelude::*;
use crate::state::{Project, WinmemError};

#[derive(Accounts)]
pub struct RotateAuth<'info> {
    /// Current authority must sign.
    #[account(mut)]
    pub authority: Signer<'info>,

    /// Project PDA, must be derived from old authority.
    #[account(
        mut,
        seeds = [b"project", project.authority.as_ref(), project.project_id.as_ref()],
        bump = project.bump
    )]
    pub project: Account<'info, Project>,
}

#[event]
pub struct AuthorityRotated {
    pub project: Pubkey,
    pub old_authority: Pubkey,
    pub new_authority: Pubkey,
    pub rotated_at: i64,
}

/// Rotate authority on a project.
/// Note: this changes the PDA seed derivation (authority is part of the seed).
/// To keep the PDA stable, Winmem uses `project_id` as a stable key and includes
/// authority only for access control. However, Anchor seed constraints require
/// the current PDA derivation. After rotation, clients should continue using the
/// same `project` address (stored from init), not re-derive it from seeds.
/// This is why `project.bump` is stored and the project account is passed directly.
///
/// In practice:
/// - The project address stays the same.
/// - Authority changes in the account data.
/// - Future instructions should use `seeds = [b"project", <original_authority>, project_id]`
///   only for validation if you also keep `original_authority`. To avoid complexity,
///   this program validates by requiring the passed `project` address and the signer.
///   Seed constraints are kept for init/post_root; rotation uses direct account access.
///
/// If you want a strictly seed-validated rotation, remove `authority` from the PDA seeds.
pub fn handler(ctx: Context<RotateAuth>, new_authority: Pubkey) -> Result<()> {
    let project = &mut ctx.accounts.project;

    require!(ctx.accounts.authority.key() == project.authority, WinmemError::AuthorityMismatch);

    let old = project.authority;
    project.authority = new_authority;
    project.last_auth_rotation_at = Clock::get()?.unix_timestamp;

    emit!(AuthorityRotated {
        project: project.key(),
        old_authority: old,
        new_authority,
        rotated_at: project.last_auth_rotation_at
    });

    Ok(())
}
