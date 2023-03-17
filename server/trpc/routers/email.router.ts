import { Like } from 'typeorm';
import { z } from 'zod';
import { procedure, router } from '~/server/trpc/trpc';
import { EmailService } from '~~/server/services/email.service';
import { queryListSchema } from '~~/server/validations/base';
import { createEmailDto } from '~~/server/validations/emails/create.dto';
import { updateEmailDto } from '~~/server/validations/emails/update.dto';

const list = procedure
  .input(
    z
      .object({
        isPredefined: z.boolean().default(false),
      })
      .merge(queryListSchema),
  )
  .query(({ input }) => {
    const emailService = new EmailService();

    return emailService.findAll(input, {
      where: {
        ...(input.search && { subject: Like(`%${input.search}%`) }),
        isPredefined: input.isPredefined,
      },
      relations: {
        recipients: true,
        groups: true,
      },
    });
  });

const deleteEmail = procedure.input(z.number()).mutation(({ input }) => {
  const emailService = new EmailService();
  return emailService.delete(input);
});

const show = procedure.input(z.number()).query(({ input }) => {
  const emailService = new EmailService();
  return emailService.findOne(input);
});

const update = procedure
  .input(
    z.object({
      id: z.number(),
      data: updateEmailDto,
    }),
  )
  .mutation(({ input: { id, data } }) => {
    const emailService = new EmailService();
    return emailService.updateEmail(id, data);
  });

const create = procedure.input(createEmailDto).mutation(({ input }) => {
  const emailService = new EmailService();
  return emailService.createEmail(input);
});

const bulkDelete = procedure
  .input(z.array(z.number()))
  .mutation(({ input }) => {
    const emailService = new EmailService();
    return emailService.bulkDelete(input);
  });

export const email = router({
  list,
  show,
  update,
  delete: deleteEmail,
  create,
  bulkDelete,
});