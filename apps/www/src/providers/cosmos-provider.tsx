'use client';

import React, { type PropsWithChildren } from 'react';

import { nillionTestnet } from '~/lib/data/chain';

import { GrazProvider } from 'graz';
import { env } from '~/env';

export const CosmosProvider = ({ children }: PropsWithChildren) => {
  return (
    <GrazProvider
      grazOptions={{
        chains: [nillionTestnet],
        walletConnect: {
          options: {
            projectId: env.NEXT_PUBLIC_WALLETCONNECT_ID,
          },
        },
      }}
    >
      {children}
    </GrazProvider>
  );
};
