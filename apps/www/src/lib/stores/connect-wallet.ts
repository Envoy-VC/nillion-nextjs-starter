import { wallets } from 'cosmos-kit';
import { create } from 'zustand';

export const supportedWallets = {
  keplr: wallets.keplr[0].walletInfo,
  leap: wallets.leap[0].walletInfo,
  vectis: wallets.vectis[0].walletInfo,
  cosmostation: wallets.cosmostation[0].walletInfo,
  station: wallets.station[0].walletInfo,
  xdefi: wallets.xdefi[0].walletInfo,
  compass: wallets.compass[0].walletInfo,
} as const;

export type WalletType = keyof typeof supportedWallets;

interface ConnectWalletStore {
  supportedWallets: typeof supportedWallets;
  isModalOpen: boolean;
  isUserModalOpen: boolean;
  activeWalletType: WalletType | null;
  error: string | null;
  showAllWallets: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  setActiveWalletType: (walletType: WalletType | null) => void;
  setError: (error: string | null) => void;
  setShowAllWallets: (showAllWallets: boolean) => void;
  setUserModalOpen: (isUserModalOpen: boolean) => void;
}

export const useConnectWalletStore = create<ConnectWalletStore>((set) => ({
  supportedWallets,
  isModalOpen: false,
  activeWalletType: null,
  error: null,
  showAllWallets: false,
  isUserModalOpen: false,
  setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
  setActiveWalletType: (activeWalletType) => set({ activeWalletType }),
  setError: (error) => set({ error }),
  setShowAllWallets: (showAllWallets) => set({ showAllWallets }),
  setUserModalOpen: (isUserModalOpen) => set({ isUserModalOpen }),
}));
