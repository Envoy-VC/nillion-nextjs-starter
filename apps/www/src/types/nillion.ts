import type { SigningStargateClient } from '@cosmjs/stargate';
import type * as n from '@nillion/client-web';
import type * as p from '@nillion/client-web/proto';

export interface GetQuoteProps {
  client: n.NillionClient;
  operation: n.Operation;
}

export interface Secret {
  name: string;
  value: string | number;
}

export interface Party {
  id: string;
  name: string;
}

export type WithNillion<T> = T & {
  nillion: typeof n;
  client: n.NillionClient;
  proto: typeof p;
  signingStargateClient: SigningStargateClient;
  address: string;
};

export interface PayQuoteProps {
  nillion: typeof n;
  signingStargateClient: SigningStargateClient;
  quote: n.PriceQuote;
  from: string;
  proto: typeof p;
  memo?: string;
}

export interface StoreSecretsProps {
  secrets: Secret[];
  memo?: string;
  ttl?: number;
  usersWithRetrievePermissions?: string[];
  usersWithUpdatePermissions?: string[];
  usersWithDeletePermissions?: string[];
  computePermissions?: {
    programIds: string[];
    users: string[];
  };
}

export interface StoreProgramProps {
  path: string;
  programName: string;
  memo?: string;
}

export interface RetrieveSecretProps {
  storeId: string;
  secretName: string;
  memo?: string;
}

export interface ComputeProps {
  programId: string;
  storeIds: string[];
  inputParties: Party[];
  outputParties: Party[];
  outputNames: string[];
  computeTimeSecrets: Secret[];
  memo?: string;
}
