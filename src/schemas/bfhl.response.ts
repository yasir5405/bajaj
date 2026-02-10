import { z } from "zod";

// Success response schema
export const successResponseSchema = z.object({
  is_success: z.literal(true),
  official_email: z.string().email(),
  data: z.union([
    z.array(z.number()), // For fibonacci and prime
    z.number(), // For lcm and hcf
    z.string(), // For AI
  ]),
});

// Error response schema
export const errorResponseSchema = z.object({
  is_success: z.literal(false),
  official_email: z.string().email(),
  message: z.string(),
});

export type SuccessResponse = z.infer<typeof successResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
