import type * as p from '@nillion/client-web/proto';

import { config } from './config';

import type { GetQuoteProps, PayQuoteProps } from '~/types/nillion';

export const getQuote = async ({ client, operation }: GetQuoteProps) => {
  const quote = await client.request_price_quote(config.clusterId, operation);
  return quote;
};

export const payQuote = async ({
  nillion,
  signingStargateClient,
  quote,
  from,
  proto,
  memo = 'Payment for quote',
}: PayQuoteProps) => {
  const denom = 'unil';
  signingStargateClient.registry.register(proto.typeUrl, proto.MsgPayFor);

  const payload: p.MsgPayFor = {
    fromAddress: from,
    resource: quote.nonce,
    amount: [{ denom, amount: quote.cost.total }],
  };

  const hash = await signingStargateClient.signAndBroadcastSync(
    from,
    [{ typeUrl: proto.typeUrl, value: payload }],
    'auto',
    memo
  );

  const receipt = new nillion.PaymentReceipt(quote, hash);
  return receipt;
};
