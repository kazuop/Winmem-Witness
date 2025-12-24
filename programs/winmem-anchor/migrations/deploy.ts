import * as anchor from "@coral-xyz/anchor";

/**
 * Anchor migration hook.
 * This runs automatically on `anchor deploy` when migrations are enabled.
 */
module.exports = async function (provider: anchor.AnchorProvider) {
  anchor.setProvider(provider);
  // No-op: program state is created via instructions.
};
