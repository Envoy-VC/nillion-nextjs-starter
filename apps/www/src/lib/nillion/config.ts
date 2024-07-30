import { env } from '~/env';

export const config = {
  clusterId: env.NEXT_PUBLIC_NILLION_CLUSTER_ID,
  bootnodes: [env.NEXT_PUBLIC_NILLION_BOOTNODE_WEBSOCKET_URL],
};
