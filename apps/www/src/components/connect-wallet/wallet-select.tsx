/* eslint-disable @next/next/no-img-element -- custom urls  */
import React from 'react';

import { nillionTestnet } from '~/lib/data/chain';

import {
  type WalletType,
  type supportedWallets,
  useConnectWalletStore,
} from '~/lib/stores';
import { cn, errorHandler } from '~/lib/utils';

import { type Variants, motion } from 'framer-motion';
import {
  type WalletType as GrazWalletType,
  checkWallet,
  useSuggestChainAndConnect,
} from 'graz';

import { Button } from '../ui/button';

import { Wallet, X } from 'lucide-react';

export const WalletSelect = () => {
  const {
    supportedWallets,
    activeWalletType,
    showAllWallets,
    setShowAllWallets,
  } = useConnectWalletStore();
  if (!activeWalletType) {
    return (
      <div className='flex flex-col'>
        <div className='flex w-full flex-col gap-1'>
          {Object.entries(supportedWallets)
            .slice(0, showAllWallets ? undefined : 4)
            .map(([type, wallet], index) => {
              return (
                <WalletButton
                  key={type}
                  index={index}
                  type={type as WalletType}
                  wallet={wallet}
                />
              );
            })}
          <Button
            className='flex h-12 w-full flex-row items-center justify-between rounded-xl bg-[rgba(0,0,0,0.02)] px-4 transition-all duration-300 ease-in-out hover:bg-[rgba(0,0,0,0.06)]'
            variant='secondary'
            onClick={() => {
              setShowAllWallets(!showAllWallets);
            }}
          >
            <div className='flex flex-row items-center gap-[10px]'>
              <Wallet className='h-6 w-6' />
              <div className='text-base font-medium'>
                {showAllWallets ? 'Show less' : 'Show all Wallets'}
              </div>
            </div>
          </Button>
        </div>
      </div>
    );
  }

  return <ConnectingComponent />;
};

interface WalletButtonProps {
  type: WalletType;
  index: number;
  wallet: (typeof supportedWallets)[keyof typeof supportedWallets];
}

const WalletButton = ({ type, wallet, index }: WalletButtonProps) => {
  const { setActiveWalletType, setError } = useConnectWalletStore();
  const { suggestAndConnectAsync } = useSuggestChainAndConnect();

  const variants: Variants = {
    initial: {
      opacity: index <= 3 ? 1 : 0,
    },
    animate: {
      opacity: 1,
      transition: {
        delay: (index - 3) * 0.1,
      },
    },
  };

  const isWalletReady = checkWallet(type as GrazWalletType);
  const logo =
    typeof wallet.logo === 'object' ? wallet.logo.major : (wallet.logo ?? '');
  return (
    <motion.button
      key={wallet.name}
      animate='animate'
      className='flex h-12 w-full flex-row items-center justify-between rounded-xl bg-[rgba(0,0,0,0.02)] px-4 transition-all duration-300 ease-in-out hover:bg-[rgba(0,0,0,0.06)]'
      initial='initial'
      type='button'
      variants={variants}
      onClick={async () => {
        try {
          setActiveWalletType(type);
          const res = await suggestAndConnectAsync({
            chainInfo: nillionTestnet,
            walletType: type as GrazWalletType,
          });
          const address =
            res.accounts['nillion-chain-testnet-1']?.bech32Address;
          if (!address) {
            throw new Error('Failed to connect');
          }
        } catch (error) {
          setError(errorHandler(error));
        }
      }}
    >
      <div className='flex flex-row items-center gap-[10px]'>
        <img alt={wallet.name} className='h-7 w-7' src={logo} />
        <div className='text-base font-medium'>{wallet.prettyName}</div>
      </div>
      {isWalletReady ? (
        <div className='rounded-lg bg-green-100 px-2 py-1 text-xs uppercase tracking-tight text-green-500'>
          installed
        </div>
      ) : null}
    </motion.button>
  );
};

const ConnectingComponent = () => {
  const { supportedWallets, activeWalletType, error } = useConnectWalletStore();
  if (!activeWalletType) return null;

  const wallet = supportedWallets[activeWalletType];
  const logo =
    typeof wallet.logo === 'object' ? wallet.logo.major : (wallet.logo ?? '');

  return (
    <div className='flex w-full flex-col items-center justify-center gap-3 py-8 text-center'>
      <div className={cn('relative', error ? '' : 'connectingLoader')}>
        <img alt={wallet.name} className='h-20 w-20 rounded-2xl' src={logo} />
        {error ? (
          <div className='absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-400'>
            <X size={16} strokeWidth={3} />
          </div>
        ) : null}
      </div>
      <div className='flex flex-col'>
        {error ? (
          <div className='text-lg font-medium text-red-400'>{error}</div>
        ) : (
          <div className='text-lg font-medium'>
            Continue in {wallet.prettyName}
          </div>
        )}
        <div className='text-sm font-medium text-neutral-500'>
          Accept Connect request in wallet
        </div>
      </div>
    </div>
  );
};
