import { GasPrice } from '@cosmjs/stargate';
import { useAccount, useStargateSigningClient } from 'graz';

import {
  createNillionClient,
  getQuote,
  payQuote,
  storeProgram as storeNillionProgram,
  storeSecrets as storeNillionSecrets,
} from '../nillion';
import { useNillionStore } from '../stores';
import { useKeyStore } from './use-keystore';

import type { Secret } from '~/types/nillion';

interface StoreSecretParams {
  secrets: Secret[];
  ttl?: number;
  memo?: string;
  usersWithRetrievePermissions?: string[];
  usersWithUpdatePermissions?: string[];
  usersWithDeletePermissions?: string[];
  computePermissions?: {
    programIds: string[];
    users: string[];
  };
}

interface StoreProgramParams {
  path: string;
  programName: string;
  memo?: string;
}

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

  const storeSecrets = async ({
    secrets,
    ttl = 30,
    memo,
    ...props
  }: StoreSecretParams) => {
    if (!signingStargateClient) {
      throw new Error('Stargate client not found');
    }
    if (!account) {
      throw new Error('Account not found');
    }
    const { client, nillion, proto } = await initialize();
    const nadaValues = new nillion.NadaValues();
    for (const secret of secrets) {
      if (typeof secret.value === 'string') {
        const byteArraySecret = new TextEncoder().encode(secret.value);
        const secretBlob = nillion.NadaValue.new_secret_blob(byteArraySecret);
        nadaValues.insert(secret.name, secretBlob);
      } else {
        const secretInteger = nillion.NadaValue.new_secret_integer(
          secret.value.toString()
        );
        nadaValues.insert(secret.name, secretInteger);
      }
    }
    const quote = await getQuote({
      client,
      operation: nillion.Operation.store_values(nadaValues, ttl),
    });

    const receipt = await payQuote({
      nillion,
      quote,
      memo,
      signingStargateClient,
      from: account.bech32Address,
      proto,
    });

    const storeId = await storeNillionSecrets({
      client,
      nillion,
      secrets: nadaValues,
      receipt,
      ...props,
    });

    return storeId;
  };

  const storeProgram = async ({
    path,
    programName,
    memo,
  }: StoreProgramParams) => {
    if (!signingStargateClient) {
      throw new Error('Stargate client not found');
    }
    if (!account) {
      throw new Error('Account not found');
    }
    const { client, nillion, proto } = await initialize();
    const res = await fetch(path);
    const buffer = new Uint8Array(await res.arrayBuffer());

    const quote = await getQuote({
      client,
      operation: nillion.Operation.store_program(buffer),
    });

    const receipt = await payQuote({
      nillion,
      quote,
      memo,
      signingStargateClient,
      from: account.bech32Address,
      proto,
    });

    const programId = await storeNillionProgram({
      client,
      receipt,
      data: buffer,
      programName,
    });

    return programId;
  };

  return { storeSecrets, storeProgram };
};
