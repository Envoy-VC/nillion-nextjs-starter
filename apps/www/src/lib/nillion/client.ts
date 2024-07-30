import type * as n from '@nillion/client-web';

import { config } from './config';

interface CreateNillionClientProps {
  nillion: typeof n;
  userKeyBase58: string;
  nodeKeySeed?: string;
}

export const createNillionClient = async ({
  nillion,
  userKeyBase58,
  nodeKeySeed,
}: CreateNillionClientProps) => {
  await nillion.default();
  const userKey = nillion.UserKey.from_base58(userKeyBase58);
  const seed = nodeKeySeed ?? crypto.randomUUID();
  const nodeKey = nillion.NodeKey.from_seed(seed);
  const client = new nillion.NillionClient(userKey, nodeKey, config.bootnodes);
  return client;
};
