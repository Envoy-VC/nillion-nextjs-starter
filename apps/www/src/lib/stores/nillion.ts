import type * as nillion from '@nillion/client-web';
import type * as proto from '@nillion/client-web/proto';
import { create } from 'zustand';

interface NillionStore {
  nillion: typeof nillion | null;
  proto: typeof proto | null;
  client: nillion.NillionClient | null;
  setNillion: (value: typeof nillion) => void;
  setNillionClient: (client: nillion.NillionClient) => void;
  setProto: (value: typeof proto) => void;
}

export const useNillionStore = create<NillionStore>((set) => ({
  client: null,
  nillion: null,
  proto: null,
  setNillion: (value) => set({ nillion: value }),
  setNillionClient: (client) => set({ client }),
  setProto: (value) => set({ proto: value }),
}));
