use anchor_lang::prelude::*;
use crate::state::{pack_name, Project};

#[derive(Accounts)]
#[instruction(project_id: Pubkey, name: String)]
pub struct InitProject<'info> {
    /// The project authority who can post roots.
    #[account(mut)]
    pub authority: Signer<'info>,

    /// Project PDA.
    /// Seeds: ["project", authority, project_id]
    #[account(
        init,
        payer = authority,
        space = Project::LEN,
        seeds = [b"project", authority.key().as_ref(), project_id.as_ref()],
        bump
    )]
    pub project: Account<'info, Project>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitProject>, project_id: Pubkey, name: String) -> Result<()> {
    let bump = *ctx.bumps.get("project").unwrap();

    let project = &mut ctx.accounts.project;
    project.authority = ctx.accounts.authority.key();
    project.project_id = project_id;
    project.bump = bump;
    project.name = pack_name(&name)?;
    project.root_count = 0;
    project.created_at = Clock::get()?.unix_timestamp;
    project.last_auth_rotation_at = 0;

    Ok(())
}
