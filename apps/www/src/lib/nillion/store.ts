import { config } from './config';
import { getQuote, payQuote } from './payment';

import type {
  StoreProgramProps,
  StoreSecretsProps,
  WithNillion,
} from '~/types/nillion';

export const storeNillionSecrets = async ({
  nillion,
  client,
  proto,
  signingStargateClient,
  address,
  secrets,
  memo = 'Store secrets',
  ttl = 30,
  usersWithRetrievePermissions = [],
  usersWithUpdatePermissions = [],
  usersWithDeletePermissions = [],
  computePermissions = {
    programIds: [],
    users: [],
  },
}: WithNillion<StoreSecretsProps>) => {
  // Nada Values
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

  // Pay Quote
  const quote = await getQuote({
    client,
    operation: nillion.Operation.store_values(nadaValues, ttl),
  });

  const receipt = await payQuote({
    nillion,
    quote,
    memo,
    signingStargateClient,
    from: address,
    proto,
  });
  const userId = client.user_id;
  const permissions = nillion.Permissions.default_for_user(userId);

  if (usersWithRetrievePermissions.length) {
    permissions.add_retrieve_permissions(usersWithRetrievePermissions);
  }

  // add update permissions to the permissions object
  if (usersWithUpdatePermissions.length) {
    permissions.add_update_permissions(usersWithUpdatePermissions);
  }

  // add delete permissions to the permissions object
  if (usersWithDeletePermissions.length) {
    permissions.add_delete_permissions(usersWithDeletePermissions);
  }

  const computeObject: Record<string, string[]> = {};

  for (const user of computePermissions.users) {
    computeObject[user] = computePermissions.programIds;
  }

  permissions.add_compute_permissions(computePermissions);

  const storeId = await client.store_values(
    config.clusterId,
    nadaValues,
    permissions,
    receipt
  );

  return storeId;
};

export const storeNillionProgram = async ({
  client,
  nillion,
  signingStargateClient,
  address,
  proto,
  path,
  programName,
  memo = 'Storing program',
}: WithNillion<StoreProgramProps>) => {
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
    from: address,
    proto,
  });
  const programID = await client.store_program(
    config.clusterId,
    programName,
    buffer,
    receipt
  );

  return programID;
};
