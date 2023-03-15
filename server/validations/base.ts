import { z } from 'zod';

export const queryListSchema = z.object({
  pageNumber: z.number().default(1),
  pageSize: z.number().default(10),
  orderBy: z.string().default('createdAt'),
  orderType: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

export const mediaIdSchema = z.object({
  id: z.number(),
});

export type QueryList = z.infer<typeof queryListSchema>;
