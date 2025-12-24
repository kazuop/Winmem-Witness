export type RetentionPolicy = {
  keepRawDays: number;
  keepEventsDays: number;
  keepMemoriesDays: number;
  keepAuditDays: number;
};

export const DefaultRetentionPolicy: RetentionPolicy = {
  keepRawDays: 30,
  keepEventsDays: 180,
  keepMemoriesDays: 3650,
  keepAuditDays: 3650
};
