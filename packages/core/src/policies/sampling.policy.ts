export type SamplingPolicy = {
  maxSignaturesPerRun: number;
  maxTransactionsPerRun: number;
  maxEventsPerWindow: number;
};

export const DefaultSamplingPolicy: SamplingPolicy = {
  maxSignaturesPerRun: 200,
  maxTransactionsPerRun: 200,
  maxEventsPerWindow: 10_000
};
