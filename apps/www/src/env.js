import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
  },
  client: {
    NEXT_PUBLIC_WALLETCONNECT_ID: z.string().min(1),
    NEXT_PUBLIC_NILLION_RPC_URL: z.string().url(),
    NEXT_PUBLIC_NILLION_REST_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_WALLETCONNECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
    NEXT_PUBLIC_NILLION_RPC_URL: process.env.NEXT_PUBLIC_NILLION_RPC_URL,
    NEXT_PUBLIC_NILLION_REST_URL: process.env.NEXT_PUBLIX_NILLION_REST_URL,
  },

  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
  emptyStringAsUndefined: true,
});
