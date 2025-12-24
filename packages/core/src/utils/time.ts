export function nowSec(): number { return Math.floor(Date.now() / 1000); }
export function iso(tsSec: number): string { return new Date(tsSec * 1000).toISOString(); }
