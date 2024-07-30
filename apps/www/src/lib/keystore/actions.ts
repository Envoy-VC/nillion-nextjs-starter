'use server';

import Cryptr from 'cryptr';
import { env } from '~/env';

export const encryptKey = (key: string) => {
  const cryptr = new Cryptr(env.KEYSTORE_SECRET);
  const encryptedKey = cryptr.encrypt(key);
  return encryptedKey;
};

export const decryptKey = (encryptedKey: string) => {
  const cryptr = new Cryptr(env.KEYSTORE_SECRET);
  const key = cryptr.decrypt(encryptedKey);
  return key;
};
