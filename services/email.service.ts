import { z } from 'zod';
import type { ApiService } from './api.service';

const email = z.object({
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  subject: z.string(),
  body: z.string(),
  sender: z.string(),
  isSms: z.boolean(),
  isVoice: z.boolean(),
  isEmail: z.boolean(),
  importanceLevel: z.string(),
  tenantId: z.string(),
});

const emails = z.object({ data: z.array(email), total: z.number() });

export type Email = z.infer<typeof email>;

export class EmailService {
  constructor(private apiService: ApiService) {
    this.apiService.setUrl('emails');
  }

  getAll() {
    return this.apiService.get(emails);
  }

  delete(id: number) {
    return this.apiService.delete(emails, `emails/${id}`);
  }

  sendEmail(data: {}) {
    return this.apiService.post(emails, data);
  }
}
