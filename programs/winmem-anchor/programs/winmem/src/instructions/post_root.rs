use anchor_lang::prelude::*;
use crate::state::{Project, Root, WinmemError};

#[derive(Accounts)]
pub struct PostRoot<'info> {
    /// Current authority must sign.
    #[account(mut)]
    pub authority: Signer<'info>,

    /// Project PDA (must match authority).
    #[account(
        mut,
        seeds = [b"project", project.authority.as_ref(), project.project_id.as_ref()],
        bump = project.bump
    )]
    pub project: Account<'info, Project>,

    /// Root PDA at the next index.
    /// Seeds: ["root", project, index_le]
    #[account(
        init,
        payer = authority,
        space = Root::LEN,
        seeds = [b"root", project.key().as_ref(), &project.root_count.to_le_bytes()],
        bump
    )]
    pub root_account: Account<'info, Root>,

    pub system_program: Program<'info, System>,
}

#[event]
pub struct RootPosted {
    pub project: Pubkey,
    pub index: u64,
    pub root: [u8; 32],
    pub posted_by: Pubkey,
    pub posted_at: i64,
}

pub fn handler(ctx: Context<PostRoot>, root: [u8; 32]) -> Result<()> {
    // Ensure authority matches current project authority.
    require!(
        ctx.accounts.authority.key() == ctx.accounts.project.authority,
        WinmemError::AuthorityMismatch
    );

    let index = ctx.accounts.project.root_count;
    let posted_at = Clock::get()?.unix_timestamp;

    let r = &mut ctx.accounts.root_account;
    r.project = ctx.accounts.project.key();
    r.index = index;
    r.root = root;
    r.posted_by = ctx.accounts.authority.key();
    r.posted_at = posted_at;

    // Increment root counter.
    ctx.accounts.project.root_count = ctx.accounts.project.root_count.checked_add(1).unwrap();

    emit!(RootPosted {
        project: ctx.accounts.project.key(),
        index,
        root,
        posted_by: ctx.accounts.authority.key(),
        posted_at
    });

    Ok(())
}
