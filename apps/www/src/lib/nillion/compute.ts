import { config } from './config';

import type { ComputeProps } from '~/types/nillion';

export const compute = async ({
  nillion,
  client,
  receipt,
  programId,
  storeIds,
  inputParties,
  outputParties,
  outputNames,
  computeTimeSecrets,
}: ComputeProps) => {
  const programBindings = new nillion.ProgramBindings(programId);

  inputParties.forEach(({ id, name }) => {
    programBindings.add_input_party(name, id);
  });

  outputParties.forEach(({ id, name }) => {
    programBindings.add_output_party(name, id);
  });

  const nadaValues = new nillion.NadaValues();
  for (const secret of computeTimeSecrets) {
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

  const uuid = await client.compute(
    config.clusterId,
    programBindings,
    storeIds,
    nadaValues,
    receipt
  );

  const computeResult = (await client.compute_result(uuid)) as Record<
    string,
    bigint | undefined
  >;

  const result: Record<string, string> = {};

  for (const name of outputNames) {
    const value = computeResult[name];
    if (value) {
      result[name] = value.toString();
    }
  }

  return result;
};
