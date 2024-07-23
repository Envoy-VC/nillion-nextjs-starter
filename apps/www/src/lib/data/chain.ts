import { env } from '~/env';

export const nillionTestnet = {
  rpc: env.NEXT_PUBLIC_NILLION_RPC_URL,
  rest: env.NEXT_PUBLIC_NILLION_REST_URL,
  nodeProvider: {
    name: 'Lavender.Five',
    email: 'hello@lavenderfive.com',
    website: 'https://www.lavenderfive.com/',
  },
  chainId: 'nillion-chain-testnet-1',
  chainName: 'Nillion Testnet',
  chainSymbolImageUrl:
    'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/nillion-chain-testnet/nil.png',
  stakeCurrency: {
    coinDenom: 'NIL',
    coinMinimalDenom: 'unil',
    coinDecimals: 6,
    coinImageUrl:
      'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/nillion-chain-testnet/nil.png',
  },
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: 'nillion',
    bech32PrefixAccPub: 'nillionpub',
    bech32PrefixValAddr: 'nillionvaloper',
    bech32PrefixValPub: 'nillionvaloperpub',
    bech32PrefixConsAddr: 'nillionvalcons',
    bech32PrefixConsPub: 'nillionvalconspub',
  },
  currencies: [
    {
      coinDenom: 'NIL',
      coinMinimalDenom: 'unil',
      coinDecimals: 6,
      coinImageUrl:
        'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/nillion-chain-testnet/nil.png',
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'NIL',
      coinMinimalDenom: 'unil',
      coinDecimals: 6,
      coinImageUrl:
        'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/nillion-chain-testnet/nil.png',
      gasPriceStep: {
        low: 0.001,
        average: 0.001,
        high: 0.01,
      },
    },
  ],
  features: [],
};
