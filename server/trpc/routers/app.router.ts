import { procedure, router } from '~/server/trpc/trpc';

export const app = router({
  title: procedure.query(() => {
    return 'Communicator';
  }),
});
