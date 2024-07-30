import { config } from './config';
import { getQuote, payQuote } from './payment';

import type { RetrieveSecretProps, WithNillion } from '~/types/nillion';

export const retrieveNillionSecret = async ({
  nillion,
  client,
  proto,
  signingStargateClient,
  address,
  storeId,
  secretName,
  memo = 'Retrieve Secret',
}: WithNillion<RetrieveSecretProps>) => {
  const quote = await getQuote({
    client,
    operation: nillion.Operation.retrieve_value(),
  });

  const receipt = await payQuote({
    nillion,
    quote,
    memo,
    signingStargateClient,
    from: address,
    proto,
  });

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
