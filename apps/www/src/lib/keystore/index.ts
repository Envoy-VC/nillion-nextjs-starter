import { IDBDatastore } from 'datastore-idb';
import type { Datastore } from 'interface-datastore';

export interface Keystore {
  datastore: Datastore;
}

export const keystore: Keystore = {
  datastore: new IDBDatastore('nillion-user-keystore'),
};
