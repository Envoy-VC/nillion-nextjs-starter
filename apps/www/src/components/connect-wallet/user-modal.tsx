/* eslint-disable @next/next/no-img-element -- safe for nillion logo */
import Link from 'next/link';

import React, { useMemo } from 'react';

import { nillionTestnet } from '~/lib/data/chain';

import { useConnectWalletStore } from '~/lib/stores';
import { truncate } from '~/lib/utils';

import Avatar from 'avvvatars-react';
import { useAccount, useBalance, useDisconnect } from 'graz';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

import { TextCopy } from '../text-copy';
import { Button } from '../ui/button';
import { AnimateChangeInHeight } from './animate-height';

import { ArrowUpRight, Compass, LogOut, X } from 'lucide-react';

export const UserModal = () => {
  const { data: account } = useAccount();
  const { isUserModalOpen, setUserModalOpen } = useConnectWalletStore();
  const { disconnectAsync } = useDisconnect();
  const { data: balance } = useBalance({
    denom: 'unil',
    bech32Address: account?.bech32Address,
    chainId: 'nillion-chain-testnet-1',
  });

  const nilBalance = useMemo(() => {
    const amount = Number(balance?.amount ?? 0);
    return Number(amount / 10 ** 6).toFixed(2);
  }, [balance?.amount]);

  if (!account) return null;

  return (
    <Dialog open={isUserModalOpen} onOpenChange={setUserModalOpen}>
      <DialogTrigger asChild>
        <Button
          className='m-0 flex flex-row items-center gap-3 !py-5 px-2'
          variant='outline'
        >
          <Avatar size={36} style='shape' value={account.name} />
          <div className='flex flex-col items-start justify-start'>
            <div className='text-base'>
              {truncate(account.bech32Address, 10)}
            </div>
            <div className='text-xs text-neutral-500'>{nilBalance} NIL</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent
        className='max-w-xs !rounded-3xl px-3 py-4'
        showCloseButton={false}
      >
        <DialogTitle className='relative text-center font-medium'>
          <div className='absolute -top-1 right-0'>
            <Button
              className='m-0 h-7 w-7 p-0'
              variant='link'
              onClick={() => {
                setUserModalOpen(false);
              }}
            >
              <X size={16} strokeWidth={3} />
            </Button>
          </div>
        </DialogTitle>
        <AnimateChangeInHeight className='flex w-full flex-col'>
          <div className='flex flex-col items-center justify-center gap-4 py-6 text-center'>
            <Avatar size={96} style='shape' value={account.name} />
            <div className='flex flex-col'>
              <div className='translate-x-[1.25rem]'>
                <TextCopy
                  className='text-xl'
                  text={account.bech32Address}
                  truncateOptions={{
                    length: 12,
                  }}
                />
              </div>
              <div className='text-base text-neutral-500'>{nilBalance} NIL</div>
            </div>
            <Link
              className='flex flex-row items-center gap-1 rounded-2xl border border-neutral-200 px-3 py-1 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-neutral-100'
              href='/'
            >
              <Compass size={16} />
              Block Explorer
              <ArrowUpRight size={16} />
            </Link>
            <div className='flex w-full flex-col pt-6'>
              <button
                className='flex h-12 w-full flex-row items-center justify-between rounded-xl bg-[rgba(0,0,0,0.02)] px-4 transition-all duration-300 ease-in-out hover:bg-[rgba(0,0,0,0.06)]'
                type='button'
              >
                <div className='flex flex-row items-center gap-[10px]'>
                  <img
                    alt='Nillion Testnet'
                    className='h-8 w-8 rounded-full'
                    src={nillionTestnet.chainSymbolImageUrl}
                  />
                  <div className='text-base font-medium'>Nillion Testnet</div>
                </div>
              </button>
              <button
                className='flex h-12 w-full flex-row items-center justify-between rounded-xl bg-[rgba(0,0,0,0.02)] px-4 transition-all duration-300 ease-in-out hover:bg-[rgba(0,0,0,0.06)]'
                type='button'
                onClick={async () => {
                  await disconnectAsync();
                  setUserModalOpen(false);
                }}
              >
                <div className='flex flex-row items-center gap-[10px]'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-neutral-300 p-2'>
                    <LogOut
                      className='h-8 w-9 text-neutral-500'
                      strokeWidth={3}
                    />
                  </div>
                  <div className='text-base font-medium text-neutral-500'>
                    Disconnect
                  </div>
                </div>
              </button>
            </div>
          </div>
        </AnimateChangeInHeight>
      </DialogContent>
    </Dialog>
  );
};
