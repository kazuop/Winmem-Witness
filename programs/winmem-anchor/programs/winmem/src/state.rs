use anchor_lang::prelude::*;

pub const PROJECT_NAME_MAX: usize = 32;

/// Project account defines the authority and holds the root counter.
#[account]
pub struct Project {
    /// Current authority allowed to post roots and rotate auth.
    pub authority: Pubkey,

    /// Stable project identifier chosen by the creator (client provided).
    pub project_id: Pubkey,

    /// PDA bump.
    pub bump: u8,

    /// Human-friendly label (fixed-length bytes).
    pub name: [u8; PROJECT_NAME_MAX],

    /// Number of roots posted so far (also the next root index).
    pub root_count: u64,

    /// Unix timestamp when initialized.
    pub created_at: i64,

    /// Unix timestamp of last authority rotation (0 if never).
    pub last_auth_rotation_at: i64,
}

impl Project {
    pub const LEN: usize =
        8 + // discriminator
        32 + // authority
        32 + // project_id
        1 +  // bump
        PROJECT_NAME_MAX + // name
        8 +  // root_count
        8 +  // created_at
        8;   // last_auth_rotation_at
}

/// Root account stores a posted Merkle root / snapshot hash.
#[account]
pub struct Root {
    /// Parent project.
    pub project: Pubkey,

    /// Root index within the project (monotonic).
    pub index: u64,

    /// 32-byte digest (Merkle root or snapshot hash).
    pub root: [u8; 32],

    /// Who posted it (must match project authority at the time).
    pub posted_by: Pubkey,

    /// Unix timestamp when posted.
    pub posted_at: i64,
}

impl Root {
    pub const LEN: usize =
        8 +  // discriminator
        32 + // project
        8 +  // index
        32 + // root
        32 + // posted_by
        8;   // posted_at
}

pub fn pack_name(name: &str) -> Result<[u8; PROJECT_NAME_MAX]> {
    let bytes = name.as_bytes();
    require!(bytes.len() <= PROJECT_NAME_MAX, WinmemError::NameTooLong);
    let mut out = [0u8; PROJECT_NAME_MAX];
    out[..bytes.len()].copy_from_slice(bytes);
    Ok(out)
}

/// Errors
#[error_code]
pub enum WinmemError {
    #[msg("Project name exceeds PROJECT_NAME_MAX bytes.")]
    NameTooLong,
    #[msg("Authority mismatch.")]
    AuthorityMismatch,
    #[msg("Invalid root digest length.")]
    InvalidRootLength,
}
