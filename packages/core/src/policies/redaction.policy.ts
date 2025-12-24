export type RedactionPolicy = {
  enabled: boolean;
  redactAccountKeys: boolean;
  redactInstructionData: boolean;
  maxAccountKeys: number;
};

export const DefaultRedactionPolicy: RedactionPolicy = {
  enabled: true,
  redactAccountKeys: false,
  redactInstructionData: true,
  maxAccountKeys: 64
};
