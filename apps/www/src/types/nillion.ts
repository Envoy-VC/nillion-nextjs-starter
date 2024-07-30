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

export interface PayQuoteProps {
  nillion: typeof n;
  signingStargateClient: SigningStargateClient;
  quote: n.PriceQuote;
  from: string;
  proto: typeof p;
  memo?: string;
}

export interface StoreSecretsProps {
  nillion: typeof n;
  client: n.NillionClient;
  secrets: n.NadaValues;
  receipt: n.PaymentReceipt;
  usersWithRetrievePermissions?: string[];
  usersWithUpdatePermissions?: string[];
  usersWithDeletePermissions?: string[];
  computePermissions?: {
    programIds: string[];
    users: string[];
  };
}

export interface StoreProgramProps {
  client: n.NillionClient;
  receipt: n.PaymentReceipt;
  data: Uint8Array;
  programName: string;
}

export interface RetrieveSecretProps {
  client: n.NillionClient;
  receipt: n.PaymentReceipt;
  storeId: string;
  secretName: string;
}

export interface ComputeProps {
  nillion: typeof n;
  client: n.NillionClient;
  receipt: n.PaymentReceipt;
  programId: string;
  storeIds: string[];
  inputParties: Party[];
  outputParties: Party[];
  outputNames: string[];
  computeTimeSecrets: Secret[];
}
