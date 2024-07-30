import { GasPrice } from '@cosmjs/stargate';
import { useAccount, useStargateSigningClient } from 'graz';

import {
  createNillionClient,
  retrieveNillionSecret,
  storeNillionProgram,
  storeNillionSecrets,
} from '../nillion';
import { computeNillion } from '../nillion/compute';
import { useNillionStore } from '../stores';
import { useKeyStore } from './use-keystore';

import type {
  ComputeProps,
  RetrieveSecretProps,
  StoreProgramProps,
  StoreSecretsProps,
} from '~/types/nillion';

export const useNillion = () => {
  const { data: account } = useAccount();
  const { getUserKey } = useKeyStore();
  const store = useNillionStore();
  const { data: signingStargateClient } = useStargateSigningClient({
    opts: { gasPrice: GasPrice.fromString('0.0unil') },
  });

  const initialize = async () => {
    if (store.client && store.nillion && store.proto) {
      return {
        client: store.client,
        nillion: store.nillion,
        proto: store.proto,
      };
    }
    if (!account) {
      throw new Error('Account not found');
    }
    const key = await getUserKey(account.bech32Address);
    const nillion = await import('@nillion/client-web');
    const proto = await import('@nillion/client-web/proto');
    const client = await createNillionClient({
      nillion,
      userKeyBase58: key.userKey,
    });
    store.setNillion(nillion);
    store.setNillionClient(client);
    store.setProto(proto);
    return { client, nillion, proto };
  };

  const storeSecrets = async (props: StoreSecretsProps) => {
    if (!signingStargateClient) {
      throw new Error('Stargate client not found');
    }
    if (!account) {
      throw new Error('Account not found');
    }
    const nillion = await initialize();

    const storeId = await storeNillionSecrets({
      ...nillion,
      signingStargateClient,
      address: account.bech32Address,
      ...props,
    });

    return storeId;
  };

  const storeProgram = async (props: StoreProgramProps) => {
    if (!signingStargateClient) {
      throw new Error('Stargate client not found');
    }
    if (!account) {
      throw new Error('Account not found');
    }
    const nillion = await initialize();

    const programId = await storeNillionProgram({
      ...nillion,
      signingStargateClient,
      address: account.bech32Address,
      ...props,
    });

    return programId;
  };

  const retrieveSecret = async (props: RetrieveSecretProps) => {
    if (!signingStargateClient) {
      throw new Error('Stargate client not found');
    }
    if (!account) {
      throw new Error('Account not found');
    }
    const nillion = await initialize();

    const value = await retrieveNillionSecret({
      ...nillion,
      signingStargateClient,
      address: account.bech32Address,
      ...props,
    });

    return value;
  };

  const compute = async (props: ComputeProps) => {
    if (!signingStargateClient) {
      throw new Error('Stargate client not found');
    }
    if (!account) {
      throw new Error('Account not found');
    }
    const nillion = await initialize();

    const value = await computeNillion({
      ...nillion,
      signingStargateClient,
      address: account.bech32Address,
      ...props,
    });

    return value;
  };

  return { storeSecrets, storeProgram, retrieveSecret, compute };
};
