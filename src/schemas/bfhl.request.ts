import { z } from "zod";

export const fibonacciSchema = z.object({
  fibonacci: z.number().int().nonnegative(),
});

export const primeSchema = z.object({
  prime: z.array(z.number().int()),
});

export const lcmSchema = z.object({
  lcm: z.array(z.number().int().positive()).min(1),
});

export const hcfSchema = z.object({
  hcf: z.array(z.number().int().positive()).min(1),
});

export const aiSchema = z.object({
  AI: z.string().min(1),
});

export const bfhlRequestSchema = z.union([
  fibonacciSchema,
  primeSchema,
  lcmSchema,
  hcfSchema,
  aiSchema,
]);

export type FibonacciRequest = z.infer<typeof fibonacciSchema>;
export type PrimeRequest = z.infer<typeof primeSchema>;
export type LcmRequest = z.infer<typeof lcmSchema>;
export type HcfRequest = z.infer<typeof hcfSchema>;
export type AIRequest = z.infer<typeof aiSchema>;
export type BfhlRequest = z.infer<typeof bfhlRequestSchema>;

export const validateSingleKey = (data: any): boolean => {
  const keys = Object.keys(data);
  return (
    keys.length === 1 &&
    ["fibonacci", "prime", "lcm", "hcf", "AI"].includes(keys[0])
  );
};
