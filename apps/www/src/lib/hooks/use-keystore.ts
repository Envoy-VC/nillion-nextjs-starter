import * as ed25519 from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';
import baseX from 'base-x';
import { Key } from 'interface-datastore';

import { keystore } from '../keystore';
import { decryptKey, encryptKey } from '../keystore/actions';

const base58 = baseX(
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
);

export const useKeyStore = () => {
  const initializeKeystore = async () => {
    if (
      'open' in keystore.datastore &&
      typeof keystore.datastore.open === 'function'
    ) {
      await keystore.datastore.open();
    }
  };

  const createUserKey = async (address: string) => {
    await initializeKeystore();
    const privateKey = ed25519.utils.randomPrivateKey();
    const publicKey = await ed25519.getPublicKeyAsync(privateKey);
    const publicKeyHash = sha512.create().update(publicKey).digest();

    const nillionUserId = base58.encode(publicKeyHash);
    const userKey = base58.encode(privateKey);
    const encryptedUserKey = encryptKey(userKey);

    const key = new Key(address);

    const arrData = new TextEncoder().encode(
      JSON.stringify({
        userId: nillionUserId,
        encryptedUserKey,
      })
    );

    await keystore.datastore.put(key, arrData);
  };

  const getUserKey = async (address: string) => {
    await initializeKeystore();

    const key = new Key(address);

    const data = await keystore.datastore.get(key);

    if (data.length === 0) {
      throw new Error('User key not found');
    }

    const decodedData = JSON.parse(new TextDecoder().decode(data)) as {
      userId: string;
      encryptedUserKey: string;
    };

    const decryptedUserKey = decryptKey(decodedData.encryptedUserKey);

    return {
      userId: decodedData.userId,
      userKey: decryptedUserKey,
    };
  };

  return { createUserKey, getUserKey };
};
