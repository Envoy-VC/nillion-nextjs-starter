import { config } from './config';
import { getQuote, payQuote } from './payment';

import type { ComputeProps, WithNillion } from '~/types/nillion';

export const computeNillion = async ({
  nillion,
  client,
  proto,
  signingStargateClient,
  address,
  programId,
  storeIds,
  inputParties,
  outputParties,
  outputNames,
  computeTimeSecrets,
  memo = 'Compute Program',
}: WithNillion<ComputeProps>) => {
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

  // Pay Quote
  const quote = await getQuote({
    client,
    operation: nillion.Operation.compute(programId, nadaValues),
  });

  const receipt = await payQuote({
    nillion,
    quote,
    memo,
    signingStargateClient,
    from: address,
    proto,
  });

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
