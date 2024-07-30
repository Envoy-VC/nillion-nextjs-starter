import { config } from './config';

import type { StoreProgramProps, StoreSecretsProps } from '~/types/nillion';

export const storeSecrets = async ({
  nillion,
  client,
  secrets,
  receipt,
  usersWithRetrievePermissions = [],
  usersWithUpdatePermissions = [],
  usersWithDeletePermissions = [],
  computePermissions = {
    programIds: [],
    users: [],
  },
}: StoreSecretsProps) => {
  const userId = client.user_id;
  const permissions = nillion.Permissions.default_for_user(userId);

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

export const storeProgram = async ({
  client,
  receipt,
  path,
  programName,
}: StoreProgramProps) => {
  const res = await fetch(path);
  const buffer = new Uint8Array(await res.arrayBuffer());

  const programID = await client.store_program(
    config.clusterId,
    programName,
    buffer,
    receipt
  );

  return programID;
};
