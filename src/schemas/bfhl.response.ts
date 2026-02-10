import { z } from "zod";

export const successResponseSchema = z.object({
  is_success: z.literal(true),
  official_email: z.string().email(),
  data: z.union([z.array(z.number()), z.number(), z.string()]),
});

export const errorResponseSchema = z.object({
  is_success: z.literal(false),
  official_email: z.string().email(),
  message: z.string(),
});

export type SuccessResponse = z.infer<typeof successResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
