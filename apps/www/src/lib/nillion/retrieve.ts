import { config } from './config';

import type { RetrieveSecretProps } from '~/types/nillion';

export const retrieveSecret = async ({
  client,
  receipt,
  storeId,
  secretName,
}: RetrieveSecretProps) => {
  const retrieved = await client.retrieve_value(
    config.clusterId,
    storeId,
    secretName,
    receipt
  );

  let result: string | number;
  try {
    result = parseInt(retrieved.to_integer());
  } catch (err) {
    const byteArraySecret = retrieved.to_byte_array();
    result = new TextDecoder('utf-8').decode(byteArraySecret);
  }

  return result;
};
