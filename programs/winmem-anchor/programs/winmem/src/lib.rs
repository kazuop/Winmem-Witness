use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;

use instructions::*;

declare_id!("WiNMmM9q9FJpQpQkX1oYxZyQpXnGx1rjQqQqQqQqQqQ");

#[program]
pub mod winmem {
    use super::*;

    /// Create a new Winmem project anchor.
    pub fn init_project(ctx: Context<init_project::InitProject>, project_id: Pubkey, name: String) -> Result<()> {
        init_project::handler(ctx, project_id, name)
    }

    /// Post a 32-byte root digest (Merkle root / snapshot hash).
    pub fn post_root(ctx: Context<post_root::PostRoot>, root: [u8; 32]) -> Result<()> {
        post_root::handler(ctx, root)
    }

    /// Rotate the project authority.
    pub fn rotate_auth(ctx: Context<rotate_auth::RotateAuth>, new_authority: Pubkey) -> Result<()> {
        rotate_auth::handler(ctx, new_authority)
    }
}
