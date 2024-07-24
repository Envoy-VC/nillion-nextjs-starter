'use client';

import { useConnectWalletStore } from '~/lib/stores';
import { sleep } from '~/lib/utils';

import { useAccount } from 'graz';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

import { AnimateChangeInHeight } from './animate-height';
import { UserModal } from './user-modal';
import { WalletSelect } from './wallet-select';

import { ChevronLeft, X } from 'lucide-react';

export const ConnectWallet = () => {
  const { data: account } = useAccount();
  const {
    isModalOpen,
    activeWalletType,
    setIsModalOpen,
    setActiveWalletType,
    setError,
    setShowAllWallets,
  } = useConnectWalletStore();

  if (!account) {
    return (
      <Dialog
        open={isModalOpen}
        onOpenChange={async (open) => {
          setIsModalOpen(open);
          await sleep(500);
          if (!open) {
            setError(null);
            setActiveWalletType(null);
            setShowAllWallets(false);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button>Connect Wallet</Button>
        </DialogTrigger>
        <DialogContent
          className='max-w-xs !rounded-3xl px-3 py-4'
          showCloseButton={false}
        >
          <DialogTitle className='relative text-center font-medium'>
            <div>Connect Wallet</div>
            {activeWalletType ? (
              <div className='absolute -top-1 left-0'>
                <Button
                  className='m-0 h-7 w-7 p-0'
                  variant='link'
                  onClick={() => {
                    setActiveWalletType(null);
                    setError(null);
                    setShowAllWallets(false);
                  }}
                >
                  <ChevronLeft size={18} strokeWidth={3} />
                </Button>
              </div>
            ) : null}
            <div className='absolute -top-1 right-0'>
              <Button
                className='m-0 h-7 w-7 p-0'
                variant='link'
                onClick={async () => {
                  setIsModalOpen(false);
                  await sleep(500);
                  setError(null);
                  setActiveWalletType(null);
                  setShowAllWallets(false);
                }}
              >
                <X size={16} strokeWidth={3} />
              </Button>
            </div>
          </DialogTitle>
          <AnimateChangeInHeight className='flex w-full flex-col'>
            <WalletSelect />
          </AnimateChangeInHeight>
        </DialogContent>
      </Dialog>
    );
  }
  return <UserModal />;
};
